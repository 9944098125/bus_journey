import type { NextFunction, Request, Response } from "express";

import type { IRoute } from "../interfaces/route.interface.js";
import { RouteService } from "../services/route.service.js";
import { sendError, sendItem, sendList } from "../utils/api-response.js";

const CONFLICT_MESSAGES = new Set(["Route code already exists"]);

const BAD_REQUEST_MESSAGES = new Set([
  "Route name is required",
  "Source city is required",
  "Destination city is required",
  "Source and destination cannot be the same",
  "Distance must be a positive number",
  "Estimated duration must be a positive number",
  "Base fare must be a positive number",
  "Route name cannot be empty",
  "Route code cannot be empty",
  "Source city cannot be empty",
  "Destination city cannot be empty",
  "Invalid route id",
  "Invalid operator id",
  "Invalid creator id",
]);

const NOT_FOUND_MESSAGES = new Set(["Route not found", "Operator not found"]);

export class RouteController {
  private readonly routeService = new RouteService();

  public createRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const createdById = req.user?._id.toString();

      if (!createdById) {
        sendError(req, res, 401, "Authentication required");
        return;
      }

      const route = await this.routeService.createRoute(
        req.body as Partial<IRoute>,
        createdById
      );

      sendItem(req, res, "Route created successfully", route, 201);
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  };

  public getRoutes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const operator = req.query.operator as string | undefined;
      const source_city = req.query.source_city as string | undefined;
      const destination_city = req.query.destination_city as string | undefined;

      let is_active: boolean | undefined;
      if (req.query.status === "inactive") {
        is_active = false;
      } else if (req.query.status === "active") {
        is_active = true;
      } else if (req.query.is_active !== undefined) {
        is_active = req.query.is_active === "true";
      }

      const result = await this.routeService.getAllRoutes(
        page,
        limit,
        search,
        operator,
        source_city,
        destination_city,
        is_active
      );

      sendList(req, res, "Routes fetched successfully", {
        pageNumber: page,
        pageSize: limit,
        totalDocuments: result.total,
        documents: result.data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getRouteById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const route = await this.routeService.getRouteById(
        req.params.id as string
      );

      sendItem(req, res, "Route fetched successfully", route);
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  };

  public updateRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const route = await this.routeService.updateRoute(
        req.params.id as string,
        req.body as Partial<IRoute>
      );

      sendItem(req, res, "Route updated successfully", route);
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  };

  public deleteRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.routeService.deleteRoute(req.params.id as string);

      sendItem(req, res, "Route deleted successfully", null);
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  };

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
