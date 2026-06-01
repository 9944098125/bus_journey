import type { Request, Response } from "express";

/**
 * Standard API response envelope used across the whole backend.
 *
 * Shape:
 * {
 *   status, statusText,
 *   data: { message, data },
 *   meta: { url }
 * }
 *
 * - List endpoints place a paginated payload in `data.data`:
 *     { pageNumber, pageSize, totalPages, totalDocuments, documents }
 * - Detail / mutation endpoints place the single item (or null) in `data.data`.
 */

const STATUS_TEXT: Record<number, string> = {
  200: "OK",
  201: "Created",
  202: "Accepted",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Entity",
  500: "Internal Server Error",
  503: "Service Unavailable",
};

const getStatusText = (status: number): string => STATUS_TEXT[status] ?? "";

const buildMeta = (req: Request): { url: string } => ({
  url: `${req.protocol}://${req.get("host") ?? ""}${req.originalUrl}`,
});

export interface PaginationPayload {
  pageNumber: number;
  pageSize: number;
  totalDocuments: number;
  totalPages?: number;
  documents: unknown[];
}

/**
 * Low-level envelope writer. Prefer the named helpers below.
 */
export const sendResponse = (
  req: Request,
  res: Response,
  statusCode: number,
  message: string,
  data: unknown = null,
  extraMeta: Record<string, unknown> = {}
): void => {
  res.status(statusCode).json({
    status: statusCode,
    statusText: getStatusText(statusCode),
    data: {
      message,
      data,
    },
    meta: {
      ...buildMeta(req),
      ...extraMeta,
    },
  });
};

/**
 * Single item / detail / mutation response.
 */
export const sendItem = (
  req: Request,
  res: Response,
  message: string,
  item: unknown = null,
  statusCode: number = 200,
  extraMeta: Record<string, unknown> = {}
): void => {
  sendResponse(req, res, statusCode, message, item, extraMeta);
};

/**
 * Paginated list response.
 */
export const sendList = (
  req: Request,
  res: Response,
  message: string,
  pagination: PaginationPayload,
  statusCode: number = 200
): void => {
  const { pageNumber, pageSize, totalDocuments, documents } = pagination;

  const totalPages =
    pagination.totalPages ??
    (pageSize > 0 ? Math.ceil(totalDocuments / pageSize) : 0);

  sendResponse(req, res, statusCode, message, {
    pageNumber,
    pageSize,
    totalPages,
    totalDocuments,
    documents,
  });
};

/**
 * Error response in the same envelope (data.data is null).
 */
export const sendError = (
  req: Request,
  res: Response,
  statusCode: number,
  message: string
): void => {
  sendResponse(req, res, statusCode, message, null);
};
