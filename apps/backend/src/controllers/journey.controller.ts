import type { NextFunction, Request, Response } from "express";

import type { IJourney, JourneyStatus } from "../interfaces/journey.interface.js";
import { JourneyService } from "../services/journey.service.js";
import { sendError, sendItem, sendList } from "../utils/api-response.js";

const CONFLICT_MESSAGES = new Set(["Journey code already exists"]);

const BAD_REQUEST_MESSAGES = new Set([
  "Valid route is required",
  "Valid bus is required",
  "Valid departure date and time is required",
  "Fare must be a positive number",
  "Available seats cannot exceed bus capacity",
  "Journey code cannot be empty",
  "Invalid journey id",
  "Invalid route id",
  "Invalid bus id",
  "Invalid creator id",
  "Invalid journey status",
]);

const NOT_FOUND_MESSAGES = new Set([
  "Journey not found",
  "Route not found",
  "Bus not found",
]);

const VALID_QUERY_STATUSES = new Set<JourneyStatus>([
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

export class JourneyController {
  private readonly journeyService = new JourneyService();

  public createJourney = async (
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

      const journey = await this.journeyService.createJourney(
        req.body as Partial<IJourney>,
        createdById
      );

      sendItem(req, res, "Journey created successfully", journey, 201);
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  };

  public getJourneys = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const route = req.query.route as string | undefined;
      const bus = req.query.bus as string | undefined;
      const operator = req.query.operator as string | undefined;
      const departure_from = req.query.departure_from as string | undefined;
      const departure_to = req.query.departure_to as string | undefined;

      const statusParam = req.query.status as string | undefined;
      const status =
        statusParam && VALID_QUERY_STATUSES.has(statusParam as JourneyStatus)
          ? (statusParam as JourneyStatus)
          : undefined;

      let is_active: boolean | undefined;
      if (req.query.is_active !== undefined) {
        is_active = req.query.is_active === "true";
      }

      const result = await this.journeyService.getAllJourneys(
        page,
        limit,
        search,
        route,
        bus,
        operator,
        status,
        is_active,
        departure_from,
        departure_to
      );

      sendList(req, res, "Journeys fetched successfully", {
        pageNumber: page,
        pageSize: limit,
        totalDocuments: result.total,
        documents: result.data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getJourneyById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const journey = await this.journeyService.getJourneyById(
        req.params.id as string
      );

      sendItem(req, res, "Journey fetched successfully", journey);
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  };

  public updateJourney = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const journey = await this.journeyService.updateJourney(
        req.params.id as string,
        req.body as Partial<IJourney>
      );

      sendItem(req, res, "Journey updated successfully", journey);
    } catch (error) {
      this.handleError(error, req, res, next);
    }
  };

  public deleteJourney = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.journeyService.deleteJourney(req.params.id as string);

      sendItem(req, res, "Journey deleted successfully", null);
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
