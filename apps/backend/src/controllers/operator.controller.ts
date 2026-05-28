import type { NextFunction, Request, Response } from "express";

import type { IOperator } from "../interfaces/operator.interface.js";
import { OperatorService } from "../services/operator.service.js";

const CONFLICT_MESSAGES = new Set([
  "Email already exists",
  "Phone number already exists",
]);

const BAD_REQUEST_MESSAGES = new Set([
  "Operator name is required",
  "Email is required",
  "Phone number is required",
  "Country code is required",
  "Driver photo is required",
  "Driving license is required",
  "Operator name cannot be empty",
  "Email cannot be empty",
  "Phone number cannot be empty",
  "Country code cannot be empty",
  "Invalid operator id",
  "Invalid creator id",
]);

const NOT_FOUND_MESSAGES = new Set(["Operator not found"]);

const getListFilters = (
  req: Request
): Partial<Pick<IOperator, "is_active">> => {
  const filters: Partial<Pick<IOperator, "is_active">> = {};

  if (req.query.status === "inactive") {
    filters.is_active = false;
  } else if (req.query.status === "active") {
    filters.is_active = true;
  } else if (req.query.is_active !== undefined) {
    filters.is_active = req.query.is_active === "true";
  }

  return filters;
};

export class OperatorController {
  private readonly operatorService = new OperatorService();

  public async createOperator(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const createdById = req.user?._id.toString();

      if (!createdById) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });

        return;
      }

      const operator = await this.operatorService.createOperator(
        req.body as Partial<IOperator>,
        createdById
      );

      res.status(201).json({
        success: true,
        message: "Operator created successfully",
        data: operator,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (CONFLICT_MESSAGES.has(error.message)) {
          res.status(409).json({
            success: false,
            message: error.message,
          });

          return;
        }

        if (BAD_REQUEST_MESSAGES.has(error.message)) {
          res.status(400).json({
            success: false,
            message: error.message,
          });

          return;
        }
      }

      next(error);
    }
  }

  public async getAllOperators(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const operators = await this.operatorService.getAllOperators(
        getListFilters(req)
      );

      res.status(200).json({
        success: true,
        count: operators.length,
        data: operators,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getOperatorById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const operator = await this.operatorService.getOperatorById(id as string);

      res.status(200).json({
        success: true,
        data: operator,
      });
    } catch (error) {
      if (error instanceof Error && NOT_FOUND_MESSAGES.has(error.message)) {
        res.status(404).json({
          success: false,
          message: error.message,
        });

        return;
      }

      if (error instanceof Error && error.message === "Invalid operator id") {
        res.status(400).json({
          success: false,
          message: error.message,
        });

        return;
      }

      next(error);
    }
  }

  public async updateOperator(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const updatedOperator = await this.operatorService.updateOperator(
        id as string,
        req.body as Partial<IOperator>
      );

      res.status(200).json({
        success: true,
        message: "Operator updated successfully",
        data: updatedOperator,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (NOT_FOUND_MESSAGES.has(error.message)) {
          res.status(404).json({
            success: false,
            message: error.message,
          });

          return;
        }

        if (CONFLICT_MESSAGES.has(error.message)) {
          res.status(409).json({
            success: false,
            message: error.message,
          });

          return;
        }

        if (BAD_REQUEST_MESSAGES.has(error.message)) {
          res.status(400).json({
            success: false,
            message: error.message,
          });

          return;
        }
      }

      next(error);
    }
  }

  public async deleteOperator(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      await this.operatorService.deleteOperator(id as string);

      res.status(200).json({
        success: true,
        message: "Operator deleted successfully",
      });
    } catch (error) {
      if (error instanceof Error && NOT_FOUND_MESSAGES.has(error.message)) {
        res.status(404).json({
          success: false,
          message: error.message,
        });

        return;
      }

      if (error instanceof Error && error.message === "Invalid operator id") {
        res.status(400).json({
          success: false,
          message: error.message,
        });

        return;
      }

      next(error);
    }
  }

  public async uploadDriverPhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
        return;
      }

      const uploadedImage = await this.operatorService.uploadDriverPhoto(
        req.file.buffer
      );
      const imageUrl = uploadedImage.secure_url;

      res.status(200).json({
        success: true,
        message: "Driver photo uploaded successfully",
        imageUrl,
        data: {
          imageUrl,
          publicId: uploadedImage.public_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public async uploadDrivingLicense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
        return;
      }

      const uploadedImage = await this.operatorService.uploadDrivingLicense(
        req.file.buffer
      );
      const imageUrl = uploadedImage.secure_url;

      res.status(200).json({
        success: true,
        message: "Driving license uploaded successfully",
        imageUrl,
        data: {
          imageUrl,
          publicId: uploadedImage.public_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
