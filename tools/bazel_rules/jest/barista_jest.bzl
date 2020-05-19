load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_test")
load("@npm_bazel_typescript//:index.bzl", "ts_config", "ts_library")
load("//tools/bazel_rules:helpers.bzl", "join")

def jest_macro(
        srcs,
        jest_config,
        setup_file,
        ts_config,
        name = "test",
        deps = [],
        **kwargs):
    # compile the spec files first
    ts_library(
        name = name + "_compile",
        srcs = srcs + [setup_file],
        tsconfig = ts_config,
        deps = deps + [
            "@npm//tslib",
            "@npm//@types/jest",
        ],
    )

    nodejs_test(
        name = name,
        data = deps + [
            ":%s_compile" % name,
            jest_config,
            setup_file,
            "@npm//babel-jest",
            "@npm//jest",
            "@npm//jest-preset-angular",
            "@npm//jest-jasmine2",
            "@npm//jest-junit",

            # needed by jest
            "@npm//chalk",
            "@npm//slash",
            "@npm//make-dir",
            "@npm//semver",
            "@npm//graceful-fs",
            "@npm//ansi-regex",

            "//:jest.config.js",
            # The root tsconfig is used by the jest resolver to resolve the
            # tsconfig path aliases
            "//:tsconfig.json",
            "//tools/bazel_rules/jest:jest-runner.js",
            "//tools/bazel_rules/jest:jest-resolver.js",
            "@npm//yargs",
        ],
        entry_point = "//tools/bazel_rules/jest:jest-runner.js",
        templated_args = [
            "--suite %s" % name,
            "--jestConfig $(rootpath %s)" % jest_config,
            "--setupFile $(rootpath %s)" % setup_file,
            "--files=\"%s\"" % join(srcs, ","),
        ],
    )
