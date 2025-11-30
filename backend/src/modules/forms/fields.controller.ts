import { Request, Response, NextFunction } from 'express';
import {
  addFieldService,
  getFieldsByFormIdService,
  updateFieldService,
  deleteFieldService,
} from './fields.service';
import { successResponse } from '../../utils/response.util';
import { HTTP_STATUS, MESSAGES } from '../../config/constants';

/**
 * Ajouter un champ à un formulaire
 * POST /api/forms/:id/fields
 */
export const addFieldController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const field = await addFieldService(req.params.id, req.body);
    successResponse(res, field, 'Field added successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtenir tous les champs d'un formulaire
 * GET /api/forms/:id/fields
 */
export const getFieldsByFormIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const fields = await getFieldsByFormIdService(req.params.id);
    successResponse(res, fields, MESSAGES.SUCCESS);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un champ
 * PUT /api/forms/fields/:fieldId
 */
export const updateFieldController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const field = await updateFieldService(req.params.fieldId, req.body);
    successResponse(res, field, MESSAGES.UPDATED);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un champ
 * DELETE /api/forms/fields/:fieldId
 */
export const deleteFieldController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await deleteFieldService(req.params.fieldId);
    successResponse(res, result, MESSAGES.DELETED);
  } catch (error) {
    next(error);
  }
};