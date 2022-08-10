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
