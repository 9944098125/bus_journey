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
  "An operator must have at least one bus",
]);

const NOT_FOUND_MESSAGES = new Set(["Operator not found"]);

const getListFilters = (
  req: Request
): Partial<Pick<IOperator, "is_active">> & { search?: string } => {
  const filters: Partial<Pick<IOperator, "is_active">> & { search?: string } = {};

  if (req.query.status === "inactive") {
    filters.is_active = false;
  } else if (req.query.status === "active") {
    filters.is_active = true;
  } else if (req.query.is_active !== undefined) {
    filters.is_active = req.query.is_active === "true";
  }
  
  if (typeof req.query.search === "string" && req.query.search.trim() !== "") {
    filters.search = req.query.search.trim();
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

}
