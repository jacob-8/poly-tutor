module.exports = {
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.98 }],
        "categories:accessibility": ["error", {"minScore": 0.8}],
        "categories:best-practices": ["error", {"minScore": 1}],
        "categories:seo": ["error", { "minScore": 1 }],
        "categories:pwa": ["error", { "minScore": 1 }],
        // "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "color-contrast": "off",
        "crawlable-anchors": "off",
        "unused-css-rules": "off",
        "uses-rel-preconnect": "off"
      }
    }
  }
}
