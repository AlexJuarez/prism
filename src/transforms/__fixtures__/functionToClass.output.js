import { Injectable, Inject } from "@angular/core";

@Injectable()
class AssetMetadataService {
  constructor(
    @Inject("mddbService") mddbService,
    @Inject("modalService") modalService
  ) {}
  openMetadata(nodeOrAsset) {
    this.mddbService.getTagNames().then(tagNames => {
      this.modalService.showDialog({
        templateUrl: "asset-metadata.html",
        cls: "override-asset-metadata-modal",
        sharedModel: {
          asset: nodeOrAsset,
          metadata: nodeOrAsset.rawMetadata,
          metadataNames: tagNames
        },

        displayFooter: false,
        buttons: []
      });
    });
  }
}

export default AssetMetadataService;
