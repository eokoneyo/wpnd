## [0.7.4](https://github.com/eokoneyo/wpnd/compare/v0.7.3...v0.7.4) (2024-12-28)


### Bug Fixes

* fix regression with provisioning wp-content through wpackagist ([10d0721](https://github.com/eokoneyo/wpnd/commit/10d07217694d18f7476e34a430cef9511d6389c1))

## [0.7.3](https://github.com/eokoneyo/wpnd/compare/v0.7.2...v0.7.3) (2024-12-15)


### Bug Fixes

* ignore mocks directory ([3afee56](https://github.com/eokoneyo/wpnd/commit/3afee566e7eee4555de0951e7f0e2277b22ece63))

## [0.7.2](https://github.com/eokoneyo/wpnd/compare/v0.7.1...v0.7.2) (2024-12-14)


### Bug Fixes

* bump wordpress version to 6.5.3 ([2cf7e31](https://github.com/eokoneyo/wpnd/commit/2cf7e31cc36af45776b31aeb38930140eabb3947))
* resolve issue with mounting project files into container volume ([0f7850d](https://github.com/eokoneyo/wpnd/commit/0f7850d180cbabbb690d3d6e68f64046787c41b4))
* resolve issue with using mysql on apple silicon ([0d49d1d](https://github.com/eokoneyo/wpnd/commit/0d49d1dc528ce66ae684c7ddfa6f1c1cc744b811))
* upgrade mysql to version 8.4, also make it an explicit dependency for wordpress container ([1494500](https://github.com/eokoneyo/wpnd/commit/1494500c265bd5147e1f874a9e57b798e2a8a147))

## [0.7.1](https://github.com/eokoneyo/wpnd/compare/v0.7.0...v0.7.1) (2023-07-04)


### Bug Fixes

* missed implementation detail with resolving path relative to config file ([dbb6015](https://github.com/eokoneyo/wpnd/commit/dbb601567b62ca33f3b22474d6420b3f59bcf2da))
* use path from parsed config to resolve container definition ([ce426b8](https://github.com/eokoneyo/wpnd/commit/ce426b8486e75120f471bce46ae0a9854270eeca))

# [0.7.0](https://github.com/eokoneyo/wpnd/compare/v0.6.0...v0.7.0) (2023-07-04)


### Features

* make resolution of src and dist directory relative to config file directory ([0c457a5](https://github.com/eokoneyo/wpnd/commit/0c457a5c6c3f95b8ac553bf5d9fcbf7741ea5e26))

# [0.6.0](https://github.com/eokoneyo/wpnd/compare/v0.5.0...v0.6.0) (2023-06-29)


### Features

* consolidate program config file parsing as command option ([33b755c](https://github.com/eokoneyo/wpnd/commit/33b755c773cdfa7cbcb3ff2e1d6088ea13305e64))
* get podamn to create container for environment ([dc1cf90](https://github.com/eokoneyo/wpnd/commit/dc1cf9094de14c9467dae66feff49c5b21f9300e))
* remove accomodation for optional custom.ini because the syntax does not work with podman ([4c2197b](https://github.com/eokoneyo/wpnd/commit/4c2197b66879d46bc253e6a1e75d473f5393ee67))
* restructure how config file is passed, also add better integration for podman across commands ([65a37b2](https://github.com/eokoneyo/wpnd/commit/65a37b212e2e7ea988b07576178081ebd24ec71c))
* specify devcontainer config on created image in place of some config.json file ([76274b8](https://github.com/eokoneyo/wpnd/commit/76274b8f7024aa4d166105e97179d929fbe09d35))
* start on adding option to attach vscode to running container ([95778b2](https://github.com/eokoneyo/wpnd/commit/95778b20cce0418fdcc55839e63d47f7d24b9c44))
* start on adding support for podman and a whole lot of refactor of files ([c034861](https://github.com/eokoneyo/wpnd/commit/c034861cfca1fe7d8591d3f5da3789c719fe1687))
* start on extending support for podman to destroy and shell ([4e4f326](https://github.com/eokoneyo/wpnd/commit/4e4f326163107b79359adb78b9a51a74efb9b3f6))
* swap skipDockerCheck for skipEngineCheck option given other engines are now supported ([b103ce1](https://github.com/eokoneyo/wpnd/commit/b103ce127d798cb88f406096671fdc065df9421f))
* switch to listr2 ([89916b6](https://github.com/eokoneyo/wpnd/commit/89916b66d5a99a8beb48f8c5f45b8907d547f9dd))
* try out new approach to reading package.json file ([c4a5b7f](https://github.com/eokoneyo/wpnd/commit/c4a5b7f87996bd01936d97e0173215b37883af96))

# [0.5.0](https://github.com/eokoneyo/wpnd/compare/v0.4.0...v0.5.0) (2023-05-24)


### Features

* fix issue with start command using whilst using npx ([43026de](https://github.com/eokoneyo/wpnd/commit/43026de7d9bb4cf7475ce1e11864c03be09f8d30))

# [0.4.0](https://github.com/eokoneyo/wpnd/compare/v0.3.0...v0.4.0) (2023-05-23)


### Bug Fixes

* resolve issue with getting config ([8f8bd37](https://github.com/eokoneyo/wpnd/commit/8f8bd37ea1bae9a140bc08740fd42d6b5facb234))


### Features

* rework how config values for program are resolved ([aa2d398](https://github.com/eokoneyo/wpnd/commit/aa2d3982a8d1c5a59fdfab7c7f79811a68168510))
* split commands into self containing files ([b72db5e](https://github.com/eokoneyo/wpnd/commit/b72db5e89589b74c76166a06dd91bf3e8a5d0e5f))

# [0.3.0](https://github.com/eokoneyo/wpnd/compare/v0.2.0...v0.3.0) (2022-08-24)


### Bug Fixes

* comment out unncessary test setup ([6c46d18](https://github.com/eokoneyo/wpnd/commit/6c46d180b076246658f37b3134a883297f318456))
* improve script to symlink files from wpnd directory into docker wp-content directory ([786839f](https://github.com/eokoneyo/wpnd/commit/786839f71b6b3a5be6c0666612e864e29d33c239))
* modify entrypoint script file to accomodate work for composer ([d0bd8ec](https://github.com/eokoneyo/wpnd/commit/d0bd8ec3c7421474fa5c22d118f7aaa44ac664bb))
* update template composer file with defaults to support custom installer paths ([76d38c1](https://github.com/eokoneyo/wpnd/commit/76d38c1eb09216ccf25692eda0ecf03389e71949))


### Features

* add composer support, also modify cli template files to accomodate composer related config ([8b63553](https://github.com/eokoneyo/wpnd/commit/8b635530faf7b31d1a3bd2cde1258d5fff7e66f0))
* add support to pre-install themes and plugins from wordpress.org using wpackagist ([5fd44c8](https://github.com/eokoneyo/wpnd/commit/5fd44c8010e8e0e7adfd4735dca397099f25cd8f))

# [0.2.0](https://github.com/eokoneyo/wpnd/compare/v0.1.0...v0.2.0) (2022-08-10)


### Features

* add support so db shell is running mysql terminal ([4a2480f](https://github.com/eokoneyo/wpnd/commit/4a2480ff9fdfda0e8ac08698a6c902d5c9c80643))

# [0.1.0](https://github.com/eokoneyo/wpnd/compare/v0.0.8...v0.1.0) (2022-07-20)


### Features

* add support to access db shell environment ([7e472c3](https://github.com/eokoneyo/wpnd/commit/7e472c39370190ece57e02a7e145eeb4cbc0acb2))

## [0.0.8](https://github.com/eokoneyo/wpnd/compare/v0.0.7...v0.0.8) (2022-07-02)


### Bug Fixes

* fix documentation pertaining to actual cli usage ([de59472](https://github.com/eokoneyo/wpnd/commit/de59472647e0a755a674f49252872e8567731458))

## [0.0.7](https://github.com/eokoneyo/wpnd/compare/v0.0.6...v0.0.7) (2022-07-01)


### Bug Fixes

* allow alternate db credentials to be passed on ([64ff8ac](https://github.com/eokoneyo/wpnd/commit/64ff8ac4f2ef1120fcc12e09faf131c01b8531d3))
* ensure app gets shutdown gracefully consistently ([d024617](https://github.com/eokoneyo/wpnd/commit/d02461724e56d07adbb366915556e45c64fcb058))
* get shell command working ([19ee04b](https://github.com/eokoneyo/wpnd/commit/19ee04b4a64f15622de8f54815b4d42fd2af55ca))
* implement check for docker compose on user's system ([0775e8e](https://github.com/eokoneyo/wpnd/commit/0775e8ee408914fe17c3d612c9351fdf6c867204))
* leverage newer docker compose api to handle destorying created image ([c2670d7](https://github.com/eokoneyo/wpnd/commit/c2670d76b0c05e53f481302c5b67e3c1dc4fda62))
* opt for simple approach with provisioning a shell ([aa68d15](https://github.com/eokoneyo/wpnd/commit/aa68d154f05d66007e3ab0f1a4ef0f7d3ab73229))
* remove unnecessary reference to env that's not passed ([59e386f](https://github.com/eokoneyo/wpnd/commit/59e386f95c18e47559cf0f1fee6a381f730035fc))
* resolve bug causing file linking to be attempted in cases when it shouldn't ([ddd6de2](https://github.com/eokoneyo/wpnd/commit/ddd6de2558f7ea0a52f62852b4ae6f2f66ffd5d7))
* switch to invoking compose on docker binary for all commands ([023f925](https://github.com/eokoneyo/wpnd/commit/023f925cce41775394a83e7e4c13df671c156be0))
* trash idea for disposable project ([3f4c547](https://github.com/eokoneyo/wpnd/commit/3f4c547607b66024cf29a563de206e598b3208d4))

## [0.0.6](https://github.com/eokoneyo/wpnd/compare/v0.0.5...v0.0.6) (2022-06-28)


### Bug Fixes

* allow files and directory for mu-plugins, to conform to standard WordPress behaviour ([2b316d5](https://github.com/eokoneyo/wpnd/commit/2b316d5ff8485eb7a16f8d295017e5591ada880c))

## [0.0.5](https://github.com/eokoneyo/wpnd/compare/v0.0.4...v0.0.5) (2022-06-20)


### Bug Fixes

* add support for mu-plugins ([d0d6d55](https://github.com/eokoneyo/wpnd/commit/d0d6d555b699efab62f46e913aec0d99e6c2ed90))
* exclude build and dev config files from being included in exported package ([c4fa8f1](https://github.com/eokoneyo/wpnd/commit/c4fa8f1aa3e7012f5213454be7d552e7430bf19b))

## [0.0.4](https://github.com/eokoneyo/wpnd/compare/v0.0.3...v0.0.4) (2022-06-20)


### Bug Fixes

* improve cli ([ea76915](https://github.com/eokoneyo/wpnd/commit/ea76915e1ecb853e82080ae1b6a1bbe6f01c731c))
* improve naming for program config getter method and fix lint issues ([6847542](https://github.com/eokoneyo/wpnd/commit/684754233f9ec7d08ff3777d19b154c093a32636))
* rework export to resolve lint issue ([546e6a9](https://github.com/eokoneyo/wpnd/commit/546e6a94c7670f4e962e041be66d0cf30b426396))
