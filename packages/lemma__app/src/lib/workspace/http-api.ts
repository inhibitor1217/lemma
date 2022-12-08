import { go, Option, Struct } from '@lemma/fx';
import { FieldResolver, PrimitiveType } from '~/lib/field';
import { HttpApi, HttpApiOffsetPagination } from '~/lib/net/http-api';
import { RMutation, RQuery } from '~/lib/react-query';
import { Workspace } from './workspace';
import { WorkspaceProfile } from './workspace-profile';

namespace View {
  export type WorkspaceProfile = {
    id: number;
    createdAt: PrimitiveType.ISO8601DateTime;
    updatedAt: PrimitiveType.ISO8601DateTime;
    displayName: string;
    photo?: string;
    workspaceId: number;
  };

  export type Workspace = {
    id: number;
    createdAt: PrimitiveType.ISO8601DateTime;
    updatedAt: PrimitiveType.ISO8601DateTime;
    slug: string;
    profile: WorkspaceProfile | null;
  };
}

export namespace WorkspaceHttpApi {
  export type GetWorkspacesWorkspaceProfileDTO = View.WorkspaceProfile;

  export type GetWorkspacesWorkspaceDTO = View.Workspace;

  export type GetWorkspacesDTO = {
    Request: HttpApiOffsetPagination.RequestDTO;
    Response: {
      workspaces: HttpApiOffsetPagination.ResponseDTO<GetWorkspacesWorkspaceDTO>;
    };
  };

  export const getWorkspaces = (requestDto: GetWorkspacesDTO['Request']) => {
    const params = new URLSearchParams();
    if (Option.isSome(requestDto.page)) {
      params.set('page', Option.unwrap(requestDto.page).toString());
    }

    return HttpApi.get<GetWorkspacesDTO['Response']>(HttpApi.url('/workspace', params));
  };

  export type SearchWorkspaceDTO = {
    Request: {
      slug: string;
    };
    Response: {
      workspace: View.Workspace;
    };
  };

  export const searchWorkspace = (requestDto: SearchWorkspaceDTO['Request']) => {
    const params = new URLSearchParams();
    params.set('slug', requestDto.slug);

    return HttpApi.get<SearchWorkspaceDTO['Response']>(HttpApi.url('/workspace/search', params));
  };

  export type CreateWorkspaceDTO = {
    Request: {
      slug: string;
      displayName?: string;
    };
    Response: {
      workspace: View.Workspace;
    };
  };

  export const createWorkspace = (requestDto: CreateWorkspaceDTO['Request']) =>
    HttpApi.post<CreateWorkspaceDTO['Request'], CreateWorkspaceDTO['Response']>(HttpApi.url('/workspace'), requestDto);
}

export namespace WorkspaceHttpApi__RQ {
  export const getWorkspaces = RQuery.makeKey('workspace', 'http-api', 'getWorkspaces');

  export const searchWorkspace = (requestDto: WorkspaceHttpApi.SearchWorkspaceDTO['Request']) =>
    RQuery.makeParametricKey('workspace', 'http-api', 'searchWorkspace', requestDto);

  export const createWorkspace = RMutation.makeKey('workspace', 'http-api', 'createWorkspace');
}

export namespace WorkspaceHttpApi__Resolver {
  const fromWorkspaceProfileView: (profileView: View.WorkspaceProfile) => WorkspaceProfile = Struct.evolve({
    id: FieldResolver.ID,
    createdAt: FieldResolver.Date.fromISO8601,
    updatedAt: FieldResolver.Date.fromISO8601,
    displayName: FieldResolver.String,
    photo: Option.map(FieldResolver.URL),
    workspaceId: FieldResolver.ID,
  });

  const fromWorkspaceView: (workspaceView: View.Workspace) => Workspace = Struct.evolve({
    id: FieldResolver.ID,
    createdAt: FieldResolver.Date.fromISO8601,
    updatedAt: FieldResolver.Date.fromISO8601,
    slug: FieldResolver.String,
    profile: Option.map(fromWorkspaceProfileView),
  });

  export const fromGetWorkspacesResultDTO = (dto: WorkspaceHttpApi.GetWorkspacesDTO['Response']) =>
    go(dto, Struct.pick('workspaces'), HttpApiOffsetPagination.resolve(fromWorkspaceView));

  export const fromSearchWorkspaceResultDTO = (dto: WorkspaceHttpApi.SearchWorkspaceDTO['Response']) =>
    go(dto, Struct.pick('workspace'), fromWorkspaceView);

  export const fromCreateWorkspaceResultDTO = (dto: WorkspaceHttpApi.CreateWorkspaceDTO['Response']) =>
    go(dto, Struct.pick('workspace'), fromWorkspaceView);
}
