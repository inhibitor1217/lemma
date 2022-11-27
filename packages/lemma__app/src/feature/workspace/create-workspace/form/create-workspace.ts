import { yupToFormErrors } from 'formik';
import * as Yup from 'yup';
import { Error, ErrorSemantic } from '~/lib/error';
import { i18nstring } from '~/lib/i18n';
import { WorkspaceHttpApi } from '~/lib/workspace';

export type CreateWorkspaceFormValues = {
  slug: string;
  displayName: string;
};

export const initialFormValues: CreateWorkspaceFormValues = {
  slug: '',
  displayName: '',
};

const createWorkspaceFormSchema = Yup.object().shape({
  slug: Yup.string()
    .min(1, i18nstring('Slug must be at least 1 character'))
    .max(32, i18nstring('Slug must be at most 32 characters'))
    .matches(/^[a-z0-9-_/]+$/, i18nstring('Slug must only contain lowercase letters, numbers, or -, _, / characters'))
    .required('Slug is required'),
  displayName: Yup.string().max(100, i18nstring('Display name must be at most 100 characters')),
});

const checkDuplicateSlug = (slug: string): Promise<boolean> =>
  WorkspaceHttpApi.searchWorkspace({ slug })
    .then(() => true)
    .catch((error) => {
      if (Error.isSemanticOf(error, ErrorSemantic.InvalidEntity)) {
        return false;
      }

      /**
       * @note
       *
       * Search query failed,
       * but still proceed with form submission.
       */
      return false;
    });

export const validateCreateWorkspaceForm = (values: CreateWorkspaceFormValues) =>
  Promise.all([
    createWorkspaceFormSchema
      .validate(values, { abortEarly: false })
      .then(() => ({}))
      .catch(yupToFormErrors),
    checkDuplicateSlug(values.slug)
      .then((isDuplicate) => (isDuplicate ? { slug: i18nstring('This slug is already taken') } : {}))
      .catch(() => ({})),
  ]).then((errors) => Object.assign(...errors));
