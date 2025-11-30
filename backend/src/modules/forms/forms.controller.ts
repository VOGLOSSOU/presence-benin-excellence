import { Request, Response, NextFunction } from 'express';
import {
  createFormService,
  getAllFormsService,
  getFormByIdService,
  updateFormService,
  deleteFormService,
  createIntervalService,
} from './forms.service';
import { successResponse } from '../../utils/response.util';
import { HTTP_STATUS, MESSAGES } from '../../config/constants';

/**
 * Créer un formulaire
 * POST /api/forms
 */
export const createFormController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const form = await createFormService(req.body);
    successResponse(res, form, MESSAGES.CREATED, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtenir tous les formulaires
 * GET /api/forms
 */
export const getAllFormsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const forms = await getAllFormsService();
    successResponse(res, forms, MESSAGES.SUCCESS);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtenir un formulaire par ID
 * GET /api/forms/:id
 */
export const getFormByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const form = await getFormByIdService(req.params.id);
    successResponse(res, form, MESSAGES.SUCCESS);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un formulaire
 * PUT /api/forms/:id
 */
export const updateFormController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const form = await updateFormService(req.params.id, req.body);
    successResponse(res, form, MESSAGES.UPDATED);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un formulaire
 * DELETE /api/forms/:id
 */
export const deleteFormController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await deleteFormService(req.params.id);
    successResponse(res, result, MESSAGES.DELETED);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un intervalle pour un formulaire
 * POST /api/forms/:id/interval
 */
export const createIntervalController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const interval = await createIntervalService(req.params.id, req.body);
    successResponse(res, interval, 'Interval created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};