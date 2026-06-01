import type { NextFunction, Request, Response } from "express";

import type { IOperator } from "../interfaces/operator.interface.js";
import { OperatorService } from "../services/operator.service.js";
import { sendError, sendItem, sendList } from "../utils/api-response.js";

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
        sendError(req, res, 401, "Authentication required");
        return;
      }

      const operator = await this.operatorService.createOperator(
        req.body as Partial<IOperator>,
        createdById
      );

      sendItem(req, res, "Operator created successfully", operator, 201);
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  }

  public async getAllOperators(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const operators = await this.operatorService.getAllOperators(
        getListFilters(req)
      );

      sendList(req, res, "Operators fetched successfully", {
        pageNumber: page,
        pageSize: limit,
        totalDocuments: operators.length,
        totalPages: 1,
        documents: operators,
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

      sendItem(req, res, "Operator fetched successfully", operator);
    } catch (error) {
      this.handleError(error, req, res, next);
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

      sendItem(req, res, "Operator updated successfully", updatedOperator);
    } catch (error) {
      this.handleError(error, req, res, next);
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

      sendItem(req, res, "Operator deleted successfully", null);
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  }

  private handleError(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (error instanceof Error) {
      if (CONFLICT_MESSAGES.has(error.message)) {
        sendError(req, res, 409, error.message);
        return;
      }

      if (NOT_FOUND_MESSAGES.has(error.message)) {
        sendError(req, res, 404, error.message);
        return;
      }

      if (BAD_REQUEST_MESSAGES.has(error.message)) {
        sendError(req, res, 400, error.message);
        return;
      }
    }

    next(error);
  }
}
