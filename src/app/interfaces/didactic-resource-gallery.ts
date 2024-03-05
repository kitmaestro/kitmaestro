import { DidacticResource } from "./didactic-resource";
import { OrderByOption, ResourceFilterOptions } from "./resource-filter-options";

export interface DidacticResourceGallery {
    resources: DidacticResource[];
    filterOptions: ResourceFilterOptions;
    addResource(resource: DidacticResource): void;
    removeResource(resourceId: string): void;
    filterResources(options: ResourceFilterOptions): DidacticResource[];
    sortResources(option: OrderByOption): void;
    likeResource(resourceId: string): void;
    dislikeResource(resourceId: string): void;
    downloadResource(resourceId: string): void;
    bookmarkResource(resourceId: string): void;
}