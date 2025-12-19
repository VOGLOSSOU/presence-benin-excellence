import React from 'react';
import { Check, Info } from 'lucide-react';

export interface SystemField {
  key: string;
  label: string;
  fieldType: 'TEXT' | 'SELECT';
  isRequired: boolean;
  description: string;
  options?: string[];
}

interface SystemFieldSelectorProps {
  availableFields: SystemField[];
  selectedFields: string[];
  onFieldToggle: (fieldKey: string) => void;
  className?: string;
}

export default function SystemFieldSelector({
  availableFields,
  selectedFields,
  onFieldToggle,
  className = ''
}: SystemFieldSelectorProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Champs système prédéfinis
            </h4>
            <p className="text-sm text-blue-700">
              Sélectionnez les informations que vous souhaitez collecter lors de l'enregistrement des visiteurs.
              Ces champs seront automatiquement mappés vers la base de données.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableFields.map((field) => {
          const isSelected = selectedFields.includes(field.key);

          return (
            <div
              key={field.key}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary-300 bg-primary-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => onFieldToggle(field.key)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                  isSelected
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-gray-300'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-semibold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                      {field.label}
                    </h4>
                    {field.isRequired && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                        Requis
                      </span>
                    )}
                  </div>

                  <p className={`text-sm mb-2 ${isSelected ? 'text-primary-700' : 'text-gray-600'}`}>
                    {field.description}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Type: {field.fieldType}</span>
                    {field.options && (
                      <span>Options: {field.options.length}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <strong>Champs sélectionnés :</strong> {selectedFields.length} sur {availableFields.length}
        {selectedFields.length === 0 && (
          <span className="text-red-600 ml-2">Au minimum les champs requis doivent être sélectionnés</span>
        )}
      </div>
    </div>
  );
}