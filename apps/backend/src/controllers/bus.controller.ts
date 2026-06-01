import type { Request, Response, NextFunction } from "express";
import { BusService } from "../services/bus.service.js";
import { sendError, sendItem, sendList } from "../utils/api-response.js";

const NOT_FOUND_MESSAGES = new Set(["Bus not found", "Invalid bus id"]);
const BAD_REQUEST_MESSAGES = new Set([
  "Bus number already exists",
  "Operator not found",
]);

export class BusController {
  private readonly busService = new BusService();

  public createBus = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;

      if (!user) {
        sendError(req, res, 401, "Unauthorized");
        return;
      }

      const bus = await this.busService.createBus(req.body, user._id.toString());

      sendItem(req, res, "Bus created successfully", bus, 201);
    } catch (error: any) {
      console.error("Error creating bus:", error);

      if (BAD_REQUEST_MESSAGES.has(error.message)) {
        sendError(req, res, 400, error.message);
        return;
      }

      sendError(req, res, 500, error.message || "Internal server error");
    }
  };

  public getBuses = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const operator = req.query.operator as string;
      const seats = req.query.seats as string;
      const bus_type = req.query.bus_type as string;

      let is_active: boolean | undefined = undefined;
      if (req.query.is_active !== undefined) {
        is_active = req.query.is_active === "true";
      }

      const result = await this.busService.getAllBuses(
        page,
        limit,
        search,
        operator,
        is_active,
        seats,
        bus_type
      );

      sendList(req, res, "Buses fetched successfully", {
        pageNumber: page,
        pageSize: limit,
        totalDocuments: result.total,
        documents: result.data,
      });
    } catch (error: any) {
      console.error("Error fetching buses:", error);
      sendError(req, res, 500, error.message || "Internal server error");
    }
  };

  public getBusById = async (req: Request, res: Response): Promise<void> => {
    try {
      const bus = await this.busService.getBusById(req.params.id as string);

      sendItem(req, res, "Bus fetched successfully", bus);
    } catch (error: any) {
      console.error("Error fetching bus by id:", error);

      if (NOT_FOUND_MESSAGES.has(error.message)) {
        sendError(req, res, 404, error.message);
        return;
      }

      sendError(req, res, 500, error.message || "Internal server error");
    }
  };

  public updateBus = async (req: Request, res: Response): Promise<void> => {
    try {
      const bus = await this.busService.updateBus(req.params.id as string, req.body);

      sendItem(req, res, "Bus updated successfully", bus);
    } catch (error: any) {
      console.error("Error updating bus:", error);

      if (NOT_FOUND_MESSAGES.has(error.message)) {
        sendError(req, res, 404, error.message);
        return;
      }

      if (error.message === "Bus number already exists") {
        sendError(req, res, 400, error.message);
        return;
      }

      sendError(req, res, 500, error.message || "Internal server error");
    }
  };

  public deleteBus = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.busService.deleteBus(req.params.id as string);

      sendItem(req, res, "Bus deleted successfully", null);
    } catch (error: any) {
      console.error("Error deleting bus:", error);

      if (NOT_FOUND_MESSAGES.has(error.message)) {
        sendError(req, res, 404, error.message);
        return;
      }

      sendError(req, res, 500, error.message || "Internal server error");
    }
  };

  public async uploadDriverPhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        sendError(req, res, 400, "No file uploaded");
        return;
      }

      const uploadedImage = await this.busService.uploadDriverPhoto(
        req.file.buffer
      );

      sendItem(req, res, "Driver photo uploaded successfully", {
        imageUrl: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
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
        sendError(req, res, 400, "No file uploaded");
        return;
      }

      const uploadedImage = await this.busService.uploadDrivingLicense(
        req.file.buffer
      );

      sendItem(req, res, "Driving license uploaded successfully", {
        imageUrl: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      });
    } catch (error) {
      next(error);
    }
  }

  public async uploadBusPhoto(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        sendError(req, res, 400, "No file uploaded");
        return;
      }

      const uploadedImage = await this.busService.uploadBusPhoto(
        req.file.buffer
      );

      sendItem(req, res, "Bus photo uploaded successfully", {
        imageUrl: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      });
    } catch (error) {
      next(error);
    }
  }
}
