import mongoose from "mongoose";
import streamifier from "streamifier";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";

import type { IBus } from "../interfaces/bus.interface.js";
import { busRepository } from "../repositories/bus.repository.js";
import { OperatorRepository } from "../repositories/operator.repository.js";

const BUS_NOT_FOUND = "Bus not found";
const INVALID_BUS_ID = "Invalid bus id";
const BUS_NUMBER_EXISTS = "Bus number already exists";
const OPERATOR_NOT_FOUND = "Operator not found";

const IMMUTABLE_UPDATE_KEYS = new Set([
  "_id",
  "created_by",
  "createdAt",
  "updatedAt",
]);

export class BusService {
  private readonly operatorRepository = new OperatorRepository();

  private assertValidObjectId(id: string): void {
    if (!mongoose.isValidObjectId(id)) {
      throw new Error(INVALID_BUS_ID);
    }
  }

  private validateCreatePayload(data: Partial<IBus>): void {
    if (!data.bus_name?.trim()) {
      throw new Error("Bus name is required");
    }

    if (!data.bus_number?.trim()) {
      throw new Error("Bus number is required");
    }

    if (!data.bus_type?.trim()) {
      throw new Error("Bus type is required");
    }

    if (data.total_seats === undefined || data.total_seats < 1) {
      throw new Error("Total seats must be at least 1");
    }

    if (!data.operator || !mongoose.isValidObjectId(data.operator.toString())) {
      throw new Error("Valid operator is required");
    }
  }

  private toUpdatePayload(data: Partial<IBus>): Partial<IBus> {
    const payload: Partial<IBus> = {};

    for (const [key, value] of Object.entries(data) as [
      keyof IBus,
      IBus[keyof IBus]
    ][]) {
      if (IMMUTABLE_UPDATE_KEYS.has(key) || value === undefined) {
        continue;
      }

      (payload as Record<string, unknown>)[key] = value;
    }

    return payload;
  }

  public async createBus(data: Partial<IBus>, createdById: string) {
    this.validateCreatePayload(data);

    if (!mongoose.isValidObjectId(createdById)) {
      throw new Error("Invalid creator id");
    }

    const operator = await this.operatorRepository.findOperatorById(
      data.operator!.toString()
    );

    if (!operator) {
      throw new Error(OPERATOR_NOT_FOUND);
    }

    const bus_number = data.bus_number!.trim().toUpperCase();

    const existingBus = await busRepository.getBusByNumber(bus_number);

    if (existingBus) {
      throw new Error(BUS_NUMBER_EXISTS);
    }

    const newBus = await busRepository.createBus({
      bus_name: data.bus_name!.trim(),
      bus_number,
      bus_type: data.bus_type!.trim(),
      total_seats: data.total_seats,
      operator: data.operator,
      amenities: data.amenities || [],
      driver_photo: data.driver_photo?.trim() || undefined,
      driving_license: data.driving_license?.trim() || undefined,
      is_active: data.is_active ?? true,
      created_by: new mongoose.Types.ObjectId(createdById),
    });

    const populated = await busRepository.getBusById(newBus._id.toString());

    if (!populated) {
      throw new Error(BUS_NOT_FOUND);
    }

    return populated;
  }

  public async getBusById(id: string) {
    this.assertValidObjectId(id);

    const bus = await busRepository.getBusById(id);

    if (!bus) {
      throw new Error(BUS_NOT_FOUND);
    }

    return bus;
  }

  public async getAllBuses(
    page: number = 1,
    limit: number = 10,
    search?: string,
    operatorId?: string,
    is_active?: boolean,
    seats?: string,
    bus_type?: string
  ) {
    const query: any = {};

    if (search) {
      const matchedOperators = await mongoose.model("Operators").find({
        operator_name: { $regex: search, $options: "i" }
      }).select('_id').lean();
      
      const operatorIds = matchedOperators.map(op => op._id);

      query.$or = [
        { bus_name: { $regex: search, $options: "i" } },
        { bus_number: { $regex: search, $options: "i" } },
      ];

      if (operatorIds.length > 0) {
        query.$or.push({ operator: { $in: operatorIds } });
      }
    }

    if (operatorId && mongoose.isValidObjectId(operatorId)) {
      query.operator = operatorId;
    }

    if (is_active !== undefined) {
      query.is_active = is_active;
    }

    if (bus_type) {
      query.bus_type = bus_type;
    }

    if (seats) {
      if (seats === "25 seats") query.total_seats = 25;
      else if (seats === "50 seats") query.total_seats = 50;
      else if (seats === "15 bearths up & down") query.total_seats = 30;
      else if (seats === "25 bearths up & down") query.total_seats = 50;
    }

    const skip = (page - 1) * limit;

    return await busRepository.getBuses(query, skip, limit);
  }

  public async updateBus(id: string, data: Partial<IBus>) {
    this.assertValidObjectId(id);

    const existing = await busRepository.getBusById(id);

    if (!existing) {
      throw new Error(BUS_NOT_FOUND);
    }

    const updatePayload = this.toUpdatePayload(data);

    if (updatePayload.bus_name !== undefined) {
      if (!updatePayload.bus_name.trim()) {
        throw new Error("Bus name cannot be empty");
      }
      updatePayload.bus_name = updatePayload.bus_name.trim();
    }

    if (updatePayload.bus_number !== undefined) {
      const bus_number = updatePayload.bus_number.trim().toUpperCase();

      if (!bus_number) {
        throw new Error("Bus number cannot be empty");
      }

      if (bus_number !== existing.bus_number) {
        const duplicateBus = await busRepository.getBusByNumber(bus_number);

        if (duplicateBus && duplicateBus._id.toString() !== id) {
          throw new Error(BUS_NUMBER_EXISTS);
        }
      }

      updatePayload.bus_number = bus_number;
    }

    if (updatePayload.bus_type !== undefined) {
      if (!updatePayload.bus_type.trim()) {
        throw new Error("Bus type cannot be empty");
      }
      updatePayload.bus_type = updatePayload.bus_type.trim();
    }

    if (updatePayload.driver_photo !== undefined) {
      updatePayload.driver_photo = updatePayload.driver_photo.trim() || undefined;
    }

    if (updatePayload.driving_license !== undefined) {
      updatePayload.driving_license = updatePayload.driving_license.trim() || undefined;
    }

    if (updatePayload.total_seats !== undefined) {
      if (updatePayload.total_seats < 1) {
        throw new Error("Total seats must be at least 1");
      }
    }

    if (updatePayload.operator !== undefined) {
      if (!mongoose.isValidObjectId(updatePayload.operator.toString())) {
        throw new Error("Invalid operator id");
      }
      const operator = await this.operatorRepository.findOperatorById(
        updatePayload.operator.toString()
      );
      if (!operator) {
        throw new Error(OPERATOR_NOT_FOUND);
      }
    }

    const updatedBus = await busRepository.updateBus(id, updatePayload);

    if (!updatedBus) {
      throw new Error(BUS_NOT_FOUND);
    }

    const populated = await busRepository.getBusById(id);
    
    return populated!;
  }

  public async deleteBus(id: string) {
    this.assertValidObjectId(id);

    const deletedBus = await busRepository.deleteBus(id);

    if (!deletedBus) {
      throw new Error(BUS_NOT_FOUND);
    }

    return deletedBus;
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

  public async uploadDriverPhoto(fileBuffer: Buffer) {
    return this.uploadImageToCloudinary(fileBuffer, "driver-photos");
  }

  public async uploadDrivingLicense(fileBuffer: Buffer) {
    return this.uploadImageToCloudinary(fileBuffer, "driving-licenses");
  }

  public async uploadBusPhoto(fileBuffer: Buffer) {
    return this.uploadImageToCloudinary(fileBuffer, "bus-photos");
  }
}
