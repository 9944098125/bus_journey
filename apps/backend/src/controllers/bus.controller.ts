import type { Request, Response, NextFunction } from "express";
import { BusService } from "../services/bus.service.js";

export class BusController {
  private readonly busService = new BusService();

  public createBus = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const bus = await this.busService.createBus(req.body, user._id.toString());

      res.status(201).json({
        success: true,
        message: "Bus created successfully",
        data: bus,
      });
    } catch (error: any) {
      console.error("Error creating bus:", error);

      if (
        error.message === "Bus number already exists" ||
        error.message === "Operator not found"
      ) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }

      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
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

      res.status(200).json({
        success: true,
        data: result.data,
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error: any) {
      console.error("Error fetching buses:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

  public getBusById = async (req: Request, res: Response): Promise<void> => {
    try {
      const bus = await this.busService.getBusById(req.params.id as string);

      res.status(200).json({
        success: true,
        data: bus,
      });
    } catch (error: any) {
      console.error("Error fetching bus by id:", error);

      if (
        error.message === "Bus not found" ||
        error.message === "Invalid bus id"
      ) {
        res.status(404).json({ success: false, message: error.message });
        return;
      }

      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

  public updateBus = async (req: Request, res: Response): Promise<void> => {
    try {
      const bus = await this.busService.updateBus(req.params.id as string, req.body);

      res.status(200).json({
        success: true,
        message: "Bus updated successfully",
        data: bus,
      });
    } catch (error: any) {
      console.error("Error updating bus:", error);

      if (
        error.message === "Bus not found" ||
        error.message === "Invalid bus id"
      ) {
        res.status(404).json({ success: false, message: error.message });
        return;
      }

      if (error.message === "Bus number already exists") {
        res.status(400).json({ success: false, message: error.message });
        return;
      }

      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

  public deleteBus = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.busService.deleteBus(req.params.id as string);

      res.status(200).json({
        success: true,
        message: "Bus deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting bus:", error);

      if (
        error.message === "Bus not found" ||
        error.message === "Invalid bus id"
      ) {
        res.status(404).json({ success: false, message: error.message });
        return;
      }

      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

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

      const uploadedImage = await this.busService.uploadDriverPhoto(
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

      const uploadedImage = await this.busService.uploadDrivingLicense(
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

  public async uploadBusPhoto(
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

      const uploadedImage = await this.busService.uploadBusPhoto(
        req.file.buffer
      );
      const imageUrl = uploadedImage.secure_url;

      res.status(200).json({
        success: true,
        message: "Bus photo uploaded successfully",
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
