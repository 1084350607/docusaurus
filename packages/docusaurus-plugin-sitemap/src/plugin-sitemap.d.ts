/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {EnumChangefreq} from 'sitemap';

export type Options = {
  changefreq?: EnumChangefreq;
  priority?: number;
  trailingSlash?: boolean;
};
