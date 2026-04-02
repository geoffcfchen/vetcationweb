// src/utils/docsNavigation.js
import sideNavData from "../data/sideNavData";

export function buildDocsSequence(topNavId) {
  const groups = sideNavData[topNavId] || [];
  const docs = [];

  groups.forEach((group) => {
    (group.items || []).forEach((item) => {
      const hasSubItems =
        Array.isArray(item.subItems) && item.subItems.length > 0;

      if (hasSubItems) {
        item.subItems.forEach((child) => {
          docs.push({
            id: child.id,
            label: child.label,
            path: `/telemedicine-info/${topNavId}/${child.id}/`,
            groupTitle: group.groupTitle,
            parentId: item.id,
            parentLabel: item.label,
          });
        });
      } else {
        docs.push({
          id: item.id,
          label: item.label,
          path: `/telemedicine-info/${topNavId}/${item.id}/`,
          groupTitle: group.groupTitle,
          parentId: null,
          parentLabel: null,
        });
      }
    });
  });

  return docs;
}

export function getPrevNextDocs(topNavId, docId) {
  const docs = buildDocsSequence(topNavId);
  const currentIndex = docs.findIndex((doc) => doc.id === docId);

  if (currentIndex === -1) {
    return {
      previousDoc: null,
      nextDoc: null,
      currentIndex: -1,
      docs,
    };
  }

  return {
    previousDoc: docs[currentIndex - 1] || null,
    nextDoc: docs[currentIndex + 1] || null,
    currentIndex,
    docs,
  };
}
