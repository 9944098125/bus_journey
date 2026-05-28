import mongoose from "mongoose";
import streamifier from "streamifier";

import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";

import type { IOperator } from "../interfaces/operator.interface.js";

import { OperatorRepository } from "../repositories/operator.repository.js";
import { busRepository } from "../repositories/bus.repository.js";
import type { IBus } from "../interfaces/bus.interface.js";

const OPERATOR_NOT_FOUND = "Operator not found";
const INVALID_OPERATOR_ID = "Invalid operator id";
const EMAIL_EXISTS = "Email already exists";
const PHONE_EXISTS = "Phone number already exists";

const IMMUTABLE_UPDATE_KEYS = new Set([
  "_id",
  "created_by",
  "createdAt",
  "updatedAt",
]);

export class OperatorService {
  private readonly operatorRepository = new OperatorRepository();

  private assertValidObjectId(id: string): void {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(INVALID_OPERATOR_ID);
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizePhone(phone_number: string): string {
    return phone_number.trim();
  }

  private normalizeCountryCode(country_code: string): string {
    const trimmed = country_code.trim();
    if (!trimmed) {
      return "";
    }
    return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
  }

  private validateCreatePayload(data: Partial<IOperator>): void {
    if (!data.operator_name?.trim()) {
      throw new Error("Operator name is required");
    }

    if (!data.email?.trim()) {
      throw new Error("Email is required");
    }

    if (!data.phone_number?.trim()) {
      throw new Error("Phone number is required");
    }

    if (!data.country_code?.trim()) {
      throw new Error("Country code is required");
    }
  }

  private toUpdatePayload(data: Partial<IOperator>): Partial<IOperator> {
    const payload: Partial<IOperator> = {};

    for (const [key, value] of Object.entries(data) as [
      keyof IOperator,
      IOperator[keyof IOperator]
    ][]) {
      if (IMMUTABLE_UPDATE_KEYS.has(key) || value === undefined) {
        continue;
      }

      (payload as Record<string, unknown>)[key] = value;
    }

    return payload;
  }

  public async createOperator(data: Partial<IOperator> & { buses?: Partial<IBus>[] }, createdById: string) {
    if (!data.buses || data.buses.length === 0) {
      throw new Error("An operator must have at least one bus");
    }

    this.validateCreatePayload(data);

    if (!mongoose.isValidObjectId(createdById)) {
      throw new Error("Invalid creator id");
    }

    const email = this.normalizeEmail(data.email as string);
    const country_code = this.normalizeCountryCode(data.country_code as string);
    const phone_number = this.normalizePhone(data.phone_number as string);

    const [existingEmail, existingPhone] = await Promise.all([
      this.operatorRepository.findOperatorByEmail(email),
      this.operatorRepository.findOperatorByPhoneNumber(
        country_code,
        phone_number
      ),
    ]);

    if (existingEmail) {
      throw new Error(EMAIL_EXISTS);
    }

    if (existingPhone) {
      throw new Error(PHONE_EXISTS);
    }

    const operator = await this.operatorRepository.createOperator({
      operator_name: (data.operator_name as string).trim(),
      email,
      country_code,
      phone_number,
      logo: data.logo?.trim() || undefined,
      gst_number: data.gst_number?.trim() || undefined,
      address: data.address?.trim() || undefined,
      is_active: data.is_active ?? true,
      created_by: new mongoose.Types.ObjectId(createdById),
    });

    const populated = await this.operatorRepository.findOperatorById(
      operator._id.toString()
    );

    if (data.buses && data.buses.length > 0) {
      for (const busData of data.buses) {
        if (!busData.bus_name?.trim() || !busData.bus_number?.trim() || !busData.bus_type?.trim() || !busData.total_seats) {
          continue; // Skip invalid buses or handle error
        }
        
        await busRepository.createBus({
          bus_name: busData.bus_name.trim(),
          bus_number: busData.bus_number.trim().toUpperCase(),
          bus_type: busData.bus_type.trim(),
          total_seats: busData.total_seats,
          operator: operator._id,
          amenities: busData.amenities || [],
          photos: busData.photos || [],
          driver_photo: busData.driver_photo?.trim() || undefined,
          driving_license: busData.driving_license?.trim() || undefined,
          is_active: busData.is_active ?? true,
          created_by: new mongoose.Types.ObjectId(createdById),
        });
      }
    }

    if (!populated) {
      throw new Error(OPERATOR_NOT_FOUND);
    }

    return populated;
  }

  public async getOperatorById(id: string) {
    this.assertValidObjectId(id);

    const operator = await this.operatorRepository.findOperatorById(id);

    if (!operator) {
      throw new Error(OPERATOR_NOT_FOUND);
    }

    return operator;
  }

  public async getAllOperators(
    filters: Partial<Pick<IOperator, "is_active">> & { search?: string } = {}
  ) {
    return this.operatorRepository.getAllOperators(filters);
  }

  public async updateOperator(id: string, data: Partial<IOperator> & { buses?: Partial<IBus>[] }) {
    this.assertValidObjectId(id);

    const existing = await this.operatorRepository.findOperatorById(id);

    if (!existing) {
      throw new Error(OPERATOR_NOT_FOUND);
    }

    const updatePayload = this.toUpdatePayload(data);

    if (updatePayload.operator_name !== undefined) {
      if (!updatePayload.operator_name.trim()) {
        throw new Error("Operator name cannot be empty");
      }

      updatePayload.operator_name = updatePayload.operator_name.trim();
    }

    if (updatePayload.email !== undefined) {
      const email = this.normalizeEmail(updatePayload.email);

      if (!email) {
        throw new Error("Email cannot be empty");
      }

      if (email !== existing.email) {
        const duplicateEmail =
          await this.operatorRepository.findOperatorByEmail(email);

        if (duplicateEmail && duplicateEmail._id.toString() !== id) {
          throw new Error(EMAIL_EXISTS);
        }
      }

      updatePayload.email = email;
    }

    if (updatePayload.phone_number !== undefined) {
      const phone_number = this.normalizePhone(updatePayload.phone_number);

      if (!phone_number) {
        throw new Error("Phone number cannot be empty");
      }

      const nextCountryCode =
        updatePayload.country_code !== undefined
          ? this.normalizeCountryCode(updatePayload.country_code)
          : existing.country_code || "+91";

      if (!nextCountryCode) {
        throw new Error("Country code cannot be empty");
      }

      if (
        phone_number !== existing.phone_number ||
        nextCountryCode !== existing.country_code
      ) {
        const duplicatePhone =
          await this.operatorRepository.findOperatorByPhoneNumber(
            nextCountryCode,
            phone_number
          );

        if (duplicatePhone && duplicatePhone._id.toString() !== id) {
          throw new Error(PHONE_EXISTS);
        }
      }

      updatePayload.phone_number = phone_number;
    }

    if (updatePayload.country_code !== undefined) {
      const country_code = this.normalizeCountryCode(updatePayload.country_code);

      if (!country_code) {
        throw new Error("Country code cannot be empty");
      }

      const nextPhoneNumber =
        updatePayload.phone_number !== undefined
          ? this.normalizePhone(updatePayload.phone_number)
          : existing.phone_number;

      if (
        country_code !== existing.country_code ||
        nextPhoneNumber !== existing.phone_number
      ) {
        const duplicatePhone =
          await this.operatorRepository.findOperatorByPhoneNumber(
            country_code,
            nextPhoneNumber
          );

        if (duplicatePhone && duplicatePhone._id.toString() !== id) {
          throw new Error(PHONE_EXISTS);
        }
      }

      updatePayload.country_code = country_code;
    }

    if (updatePayload.logo !== undefined) {
      updatePayload.logo = updatePayload.logo.trim() || undefined;
    }

    if (updatePayload.gst_number !== undefined) {
      updatePayload.gst_number = updatePayload.gst_number.trim() || undefined;
    }

    if (updatePayload.address !== undefined) {
      updatePayload.address = updatePayload.address.trim() || undefined;
    }

    const updatedOperator = await this.operatorRepository.updateOperator(
      id,
      updatePayload
    );

    if (!updatedOperator) {
      throw new Error(OPERATOR_NOT_FOUND);
    }

    if (data.buses) {
      const existingBusesResult = await busRepository.getBuses({ operator: id }, 0, 1000);
      const existingBuses = existingBusesResult.data;

      const incomingBusIds = new Set(data.buses.filter(b => b._id).map(b => b._id!.toString()));

      for (const existingBus of existingBuses) {
        if (!incomingBusIds.has(existingBus._id.toString())) {
          await busRepository.deleteBus(existingBus._id.toString());
        }
      }

      for (const busData of data.buses) {
        if (!busData.bus_name?.trim() || !busData.bus_number?.trim() || !busData.bus_type?.trim() || !busData.total_seats) {
          continue;
        }

        if (busData._id) {
          await busRepository.updateBus(busData._id.toString(), {
            bus_name: busData.bus_name.trim(),
            bus_number: busData.bus_number.trim().toUpperCase(),
            bus_type: busData.bus_type.trim(),
            total_seats: Number(busData.total_seats),
            amenities: busData.amenities || [],
            photos: busData.photos || [],
            driver_photo: busData.driver_photo?.trim() || undefined,
            driving_license: busData.driving_license?.trim() || undefined,
            is_active: busData.is_active ?? true,
          });
        } else {
          await busRepository.createBus({
            bus_name: busData.bus_name.trim(),
            bus_number: busData.bus_number.trim().toUpperCase(),
            bus_type: busData.bus_type.trim(),
            total_seats: Number(busData.total_seats),
            operator: new mongoose.Types.ObjectId(id),
            amenities: busData.amenities || [],
            photos: busData.photos || [],
            driver_photo: busData.driver_photo?.trim() || undefined,
            driving_license: busData.driving_license?.trim() || undefined,
            is_active: busData.is_active ?? true,
            created_by: existing.created_by,
          });
        }
      }
    }

    return updatedOperator;
  }

  public async deleteOperator(id: string) {
    this.assertValidObjectId(id);

    const deletedOperator = await this.operatorRepository.deleteOperator(id);

    if (!deletedOperator) {
      throw new Error(OPERATOR_NOT_FOUND);
    }

    return deletedOperator;
  }

  private async uploadImageToCloudinary(
    fileBuffer: Buffer,
    folder: string
  ): Promise<{
    secure_url: string;
    public_id: string;
  }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error || !result) {
            reject(error);
            return;
          }

          const imageUrl = result.secure_url ?? result.url;

          if (!imageUrl) {
            reject(new Error("Cloudinary upload did not return an image URL"));
            return;
          }

          resolve({
            secure_url: imageUrl,
            public_id: result.public_id,
          });
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  }
}
