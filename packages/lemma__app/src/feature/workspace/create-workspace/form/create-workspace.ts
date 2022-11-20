import * as Yup from 'yup';
import { i18nstring } from '~/lib/i18n';

export type CreateWorkspaceFormValues = {
  slug: string;
  displayName: string;
};

export const initialFormValues: CreateWorkspaceFormValues = {
  slug: '',
  displayName: '',
};

export const createWorkspaceFormSchema = Yup.object().shape({
  slug: Yup.string()
    .min(1, i18nstring('Slug must be at least 1 character'))
    .max(32, i18nstring('Slug must be at most 32 characters'))
    .matches(/^[a-z0-9-_/]+$/, i18nstring('Slug must only contain lowercase letters, numbers, or -, _, / characters'))
    .required('Slug is required'),
  displayName: Yup.string()
    .min(1, i18nstring('Display name must be at least 1 character'))
    .max(100, i18nstring('Display name must be at most 100 characters')),
});
