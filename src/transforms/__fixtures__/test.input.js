/**
 * @ngInject
 * @ngdoc service
 * @name app.asset-metadata.service:assetMetadataFactory
 * @description Handles launching preview window and showing errors if data isn't available
 * @author Chris_Haigy
 */

assetMetadataFactory.$inject = ['mddbService', 'modalService'];

function assetMetadataFactory(mddbService, modalService) {
  return {
    openMetadata: openMetadata,
  };

  function openMetadata(nodeOrAsset) {
    mddbService.getTagNames().then(tagNames => {
      modalService.showDialog({
        templateUrl: 'asset-metadata.html',
        cls: 'override-asset-metadata-modal',
        sharedModel: {
          asset: nodeOrAsset,
          metadata: nodeOrAsset.rawMetadata,
          metadataNames: tagNames,
        },
        displayFooter: false,
        buttons: [],
      });
    });
  }
}

export default assetMetadataFactory;
