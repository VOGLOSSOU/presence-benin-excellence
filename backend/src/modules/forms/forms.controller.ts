import { Request, Response, NextFunction } from 'express';
import {
  getAllFormTemplatesService,
  getFormTemplateByIdService,
  createFormTemplateService,
  updateFormTemplateService,
  deleteFormTemplateService,
  toggleFormTemplateStatusService,
  getPublicFormTemplatesService,
  getPublicFormTemplateByIdService,
} from './forms.service';
import { successResponse } from '../../utils/response.util';
import { HTTP_STATUS } from '../../config/constants';

/**
 * Récupérer tous les formulaires de l'organisation
 * GET /api/admin/forms
 */
export const getAllFormTemplatesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = (req as any).user.tenantId;
    const forms = await getAllFormTemplatesService(tenantId);
    successResponse(res, forms, 'Formulaires récupérés avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un formulaire par ID
 * GET /api/admin/forms/{formId}
 */
export const getFormTemplateByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { formId } = req.params;
    const tenantId = (req as any).user.tenantId;

    const form = await getFormTemplateByIdService(formId, tenantId);
    if (!form) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Formulaire introuvable',
      });
      return;
    }

    successResponse(res, form, 'Formulaire récupéré avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouveau formulaire
 * POST /api/admin/forms
 */
export const createFormTemplateController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = (req as any).user.tenantId;
    const form = await createFormTemplateService(req.body, tenantId);
    successResponse(res, form, 'Formulaire créé avec succès', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un formulaire
 * PUT /api/admin/forms/{formId}
 */
export const updateFormTemplateController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { formId } = req.params;
    const tenantId = (req as any).user.tenantId;

    const form = await updateFormTemplateService(formId, tenantId, req.body);
    successResponse(res, form, 'Formulaire mis à jour avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un formulaire
 * DELETE /api/admin/forms/{formId}
 */
export const deleteFormTemplateController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { formId } = req.params;
    const tenantId = (req as any).user.tenantId;

    await deleteFormTemplateService(formId, tenantId);
    successResponse(res, null, 'Formulaire supprimé avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Activer/Désactiver un formulaire
 * PUT /api/admin/forms/{formId}/toggle-status
 */
export const toggleFormTemplateStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { formId } = req.params;
    const tenantId = (req as any).user.tenantId;

    const form = await toggleFormTemplateStatusService(formId, tenantId);
    successResponse(res, form, 'Statut du formulaire mis à jour avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les formulaires actifs d'une organisation (public)
 * GET /api/forms/public/{tenantId}
 */
export const getPublicFormTemplatesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tenantId } = req.params;
    const forms = await getPublicFormTemplatesService(tenantId);
    successResponse(res, forms, 'Formulaires récupérés avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un formulaire spécifique d'une organisation (public)
 * GET /api/forms/public/{tenantId}/{formId}
 */
export const getPublicFormTemplateByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tenantId, formId } = req.params;
    const form = await getPublicFormTemplateByIdService(tenantId, formId);

    if (!form) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Formulaire introuvable',
      });
      return;
    }

    successResponse(res, form, 'Formulaire récupéré avec succès');
  } catch (error) {
    next(error);
  }
};

// All controllers are already exported above