import { FieldResolver, PrimitiveType } from '~/lib/field';
import { Option, Struct } from '~/lib/fx';
import { HttpApi, HttpApiOffsetPagination } from '~/lib/net/http-api';
import { RQuery } from '~/lib/react-query';
import { Workspace } from './workspace';
import { WorkspaceProfile } from './workspace-profile';

export namespace WorkspaceHttpApi {
  export type GetWorkspacesWorkspaceProfileDTO = {
    id: number;
    createdAt: PrimitiveType.ISO8601DateTime;
    updatedAt: PrimitiveType.ISO8601DateTime;
    displayName: string;
    photo?: string;
    workspaceId: number;
  };

  export type GetWorkspacesWorkspaceDTO = {
    id: number;
    createdAt: PrimitiveType.ISO8601DateTime;
    updatedAt: PrimitiveType.ISO8601DateTime;
    slug: string;
    profile: GetWorkspacesWorkspaceProfileDTO | null;
  };

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

    return HttpApi.get<GetWorkspacesDTO['Response']>(HttpApi.url('/workspaces', params));
  };
}

export namespace WorkspaceHttpApi__RQ {
  /**
   * @todo Should consider pagination here.
   */
  export const getWorkspaces = RQuery.makeKey('workspace', 'http-api', 'getWorkspaces');
}

export namespace WorkspaceHttpApi__Resolver {
  export namespace WorkspaceProfile {
    export const fromGetWorkspacesResultDTO: (dto: WorkspaceHttpApi.GetWorkspacesWorkspaceProfileDTO) => WorkspaceProfile =
      Struct.evolve({
        id: FieldResolver.ID,
        createdAt: FieldResolver.Date.fromISO8601,
        updatedAt: FieldResolver.Date.fromISO8601,
        displayName: FieldResolver.String,
        photo: Option.map(FieldResolver.URL),
        workspaceId: FieldResolver.ID,
      });
  }

  export namespace Workspace {
    export const fromGetWorkspacesResultDTO: (dto: WorkspaceHttpApi.GetWorkspacesWorkspaceDTO) => Workspace = Struct.evolve({
      id: FieldResolver.ID,
      createdAt: FieldResolver.Date.fromISO8601,
      updatedAt: FieldResolver.Date.fromISO8601,
      slug: FieldResolver.String,
      profile: Option.map(WorkspaceProfile.fromGetWorkspacesResultDTO),
    });
  }
}
