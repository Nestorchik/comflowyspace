import { Extension, getExtensionDir } from "./types";
import * as fsExtra from 'fs-extra';
import path from 'path';
import logger from "../utils/logger";
import extensionList from './extension-list.json';
import { checkExtensionsInstalled } from "./check-extension-status";
import _ from "lodash";
/**
 * Find all frontend extensions
 */
export async function findAllInstalledExtensions({
  doFetch = false,
  doUpdateCheck = false,
  doUpdate = false
}): Promise<Extension[]> {
  try {
    const allExtensions = extensionList.custom_nodes as unknown as Extension[];
    const custom_nodes_path = getExtensionDir();
    const ret: Extension[] = [];
    const files = await fsExtra.readdir(custom_nodes_path);
    for (const file of files) {
      if (file.endsWith('.disabled')) {
        continue
      }
      const extension = allExtensions.find(it => it.title === file);
      if (extension) {
        ret.push(_.cloneDeep(extension));
      }
    }
    await checkExtensionsInstalled(ret, doFetch, doUpdateCheck, doUpdate);
    return ret;
  } catch (err: any) {
    logger.info("findAllFrontendExtensions:", err);
    return [];
  }
}