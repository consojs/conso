import fs from "fs";
import path from "path";
import { build } from "esbuild";

const compatESModuleRequire = (m) => (m.__esModule ? m.default : m);

const getConfigFile = (fileNameWithoutExt) => {
  for (const ext of ["ts", "js"]) {
    const filePath = path.resolve(`${fileNameWithoutExt}.${ext}`);
    if (fs.existsSync(filePath)) {
      return compatESModuleRequire(require(filePath));
    }
  }
};
const defaultConfig = {
  compilerOptions: {
    entryPoints: ["src/index.ts"],
    outdir: "build",
    platform: "node",
    format: "cjs",
    watch: true,
  },
};
export const getUserConfig = () => {
  const userConfig = getConfigFile("conso.config");

  const compilerOptions = Object.assign(
    defaultConfig.compilerOptions,
    userConfig.compilerOptions
  );

  build(compilerOptions)
    .then((res) => {
      console.log("res  ", res);
    })
    .catch(() => process.exit(1));
};

getUserConfig();
