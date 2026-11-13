/**
 * Seed script for CMake Mastery Course modules and quiz questions.
 * Run with: node scripts/seed-cmake-modules.mjs
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = { execute: (sql, params) => connection.execute(sql, params) };

// ============ MODULE DEFINITIONS ============
const CMAKE_MODULES = [
  // Track: Foundations (1-5)
  {
    moduleNumber: 1,
    track: "foundations",
    title: "Why CMake? The Build System Awakening",
    subtitle: "Understanding the chaos that CMake was born to solve",
    estimatedMinutes: 15,
    sparkContent: `## Dear Marilyn,

I have been on a project for six months. We have developers on Windows, Mac, and Linux. Every time someone joins the team, they spend two days just trying to build the project. We have three different Makefiles, a Visual Studio solution, and an Xcode project — all supposedly for the same codebase. They are always out of sync. I feel like I am maintaining four projects instead of one.

— Desperate in Denver

---

## Marilyn Responds:

Your suffering is not a personal failing. It is the inevitable consequence of a fundamental misunderstanding about what a build system is *for*.

You have been maintaining **build instructions** when you should be maintaining **build intent**. A Makefile tells the compiler *how* to build your code on Linux. An Xcode project tells Xcode *how* to build your code on macOS. But neither of them captures *what* you are trying to build — the relationships between components, the dependencies, the options.

**CMake is not a build system.** This is the insight that changes everything.

CMake is a **build system generator**. It is a meta-build system. You write your build logic once, in CMake's language, and CMake generates the appropriate native build files for any platform: Makefiles on Linux, Visual Studio solutions on Windows, Xcode projects on macOS.

Think of it this way: a recipe is not a kitchen. A recipe is the *intent* — the ingredients, the relationships, the steps. The kitchen (your oven, your pots) is the *mechanism*. CMake is the recipe. Make, Ninja, Visual Studio — those are the kitchens.

The moment you write your first \`CMakeLists.txt\`, you stop maintaining four projects and start maintaining one.

---

## The Core Concept: One Source, Many Targets

CMake operates in two distinct phases:

**Phase 1 — Configuration:** CMake reads your \`CMakeLists.txt\` files, inspects your system, and generates native build files. This is where CMake *thinks*.

**Phase 2 — Build:** The native build tool (Make, Ninja, MSBuild) reads those generated files and compiles your code. This is where the machine *acts*.

This separation is the genius of CMake. Your logic lives in Phase 1. The heavy lifting happens in Phase 2. You never need to touch Phase 2 directly.

### Why CMake Won

| Feature | Raw Makefiles | CMake |
|---|---|---|
| Cross-platform | No | Yes |
| Dependency detection | Manual | Automatic |
| Out-of-source builds | Awkward | Native |
| IDE integration | None | First-class |
| Package management | None | Built-in |
| Testing integration | None | CTest |
| Packaging | None | CPack |

CMake is now the *lingua franca* of C and C++ build systems. Major projects — LLVM, KDE, OpenCV, Qt, VTK — all use CMake. If you write C or C++, you will encounter CMake. The question is whether you will understand it, or merely fear it.`,

    cruciblePrompt: `**The Crucible: Your First CMakeLists.txt**

You have a simple C++ project with one source file, \`hello.cpp\`, that contains a \`main()\` function. Your task is to write the minimum viable \`CMakeLists.txt\` that:

1. Declares the minimum required CMake version as 3.20
2. Names the project "HelloWorld" with version 1.0
3. Creates an executable target named \`hello\` from \`hello.cpp\`

Write the complete \`CMakeLists.txt\` file contents. Then describe the two commands you would run to configure and build this project in a directory called \`build/\`.`,

    crucibleSample: `\`\`\`cmake
cmake_minimum_required(VERSION 3.20)
project(HelloWorld VERSION 1.0)
add_executable(hello hello.cpp)
\`\`\`

**Build commands:**
\`\`\`bash
cmake -S . -B build
cmake --build build
\`\`\`

The \`-S .\` flag specifies the source directory (where CMakeLists.txt lives), and \`-B build\` specifies the binary directory where generated files and build artifacts will go. This is an out-of-source build — the source tree remains clean.`,

    imprintContent: `## The Imprint: What Did You Just Learn?

Close your eyes and picture this: a single recipe card sitting on a table. On one side, it says "Build a hello world program." On the other side, it says nothing — because the recipe doesn't care whether you're using a gas stove or an electric one.

**That recipe card is your CMakeLists.txt.**

CMake's purpose is to separate *what you want to build* from *how the machine builds it*. This is not a minor convenience. It is the difference between a project that works on one developer's machine and a project that works everywhere.

**The three things you must never forget about CMake:**

1. **CMake generates; it does not build.** The build tool (Make, Ninja, MSBuild) does the actual compilation.
2. **Always build out-of-source.** Never run \`cmake .\` in your source directory. Always use \`cmake -S . -B build\`.
3. **CMakeLists.txt is your single source of truth.** One file to rule them all platforms.`,
  },

  {
    moduleNumber: 2,
    track: "foundations",
    title: "Getting Started: Install, Configure, and Run",
    subtitle: "The command-line and GUI tools — your first real build",
    estimatedMinutes: 15,
    sparkContent: `## Dear Marilyn,

I installed CMake but I have no idea where to start. There seem to be multiple tools — cmake, ctest, cpack, ccmake, cmake-gui. Which one do I use? And what is this "generator" thing everyone keeps mentioning?

— Confused in Calgary

---

## Marilyn Responds:

The CMake family of tools is a small, coherent ecosystem. Each tool has a single, well-defined purpose. Once you understand the family, the confusion dissolves.

**The CMake Family:**

| Tool | Purpose |
|---|---|
| \`cmake\` | Configure and generate build files; also build and install |
| \`ctest\` | Run tests defined in your project |
| \`cpack\` | Create distributable packages (installers, archives) |
| \`ccmake\` | Curses-based interactive configuration (terminal UI) |
| \`cmake-gui\` | Graphical configuration tool |
| \`cmake-server\` | IDE integration protocol (deprecated, replaced by file API) |

For day-to-day work, you will use \`cmake\` almost exclusively. \`ctest\` and \`cpack\` come into play once your project has tests and packaging.

---

## The Generator: Choosing Your Kitchen

When you run \`cmake\`, you must tell it which build system to generate files for. This is the **generator**.

\`\`\`bash
cmake -G "Unix Makefiles" -S . -B build    # Linux/macOS
cmake -G "Ninja" -S . -B build             # Fast, cross-platform
cmake -G "Visual Studio 17 2022" -S . -B build  # Windows
cmake -G "Xcode" -S . -B build             # macOS Xcode
\`\`\`

If you omit \`-G\`, CMake picks a sensible default for your platform. On Linux, that's usually Unix Makefiles. On Windows, it's usually the newest Visual Studio version found.

**Ninja is the recommended generator** for most projects. It is faster than Make, works on all platforms, and produces cleaner output.

---

## The Three-Step Dance

Every CMake project follows this pattern:

\`\`\`bash
# Step 1: Configure (generates build files)
cmake -S . -B build

# Step 2: Build (compiles the code)
cmake --build build

# Step 3: Install (optional, copies to system)
cmake --install build
\`\`\`

You can also pass build-type flags:
\`\`\`bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release
\`\`\`

The four standard build types are: \`Debug\`, \`Release\`, \`RelWithDebInfo\`, and \`MinSizeRel\`.`,

    cruciblePrompt: `**The Crucible: Configure and Inspect**

You have a project with a \`CMakeLists.txt\`. Your task:

1. Write the command to configure the project using the Ninja generator, in Release mode, placing build files in a directory called \`build-release/\`.
2. Write the command to build only a specific target named \`mylib\` from that build directory.
3. Write the command to list all available targets in the project.
4. What file would you examine to understand what CMake detected about your system during configuration?`,

    crucibleSample: `1. \`cmake -G Ninja -DCMAKE_BUILD_TYPE=Release -S . -B build-release\`
2. \`cmake --build build-release --target mylib\`
3. \`cmake --build build-release --target help\`
4. You would examine \`build-release/CMakeCache.txt\` — this file contains all the variables CMake detected and cached during configuration, including compiler paths, library locations, and feature flags.`,

    imprintContent: `## The Imprint: The Three-Step Dance

Burn this into your memory: **Configure → Build → Install.**

CMake is always in one of these three phases. The \`cmake\` command handles all three, but they are distinct operations with distinct purposes.

**The critical insight:** The build directory is *disposable*. If something goes wrong, delete the build directory and start over. Your source code is sacred. Your build directory is ephemeral.

**Never commit your build directory to version control.** Add \`build/\` to your \`.gitignore\` immediately.`,
  },

  {
    moduleNumber: 3,
    track: "foundations",
    title: "Writing CMakeLists Files",
    subtitle: "Targets, commands, and the language of build intent",
    estimatedMinutes: 20,
    sparkContent: `## Dear Marilyn,

I understand the basics of CMake, but my CMakeLists.txt files are becoming a mess. I'm using \`include_directories()\`, \`link_libraries()\`, and \`add_definitions()\` everywhere, and a colleague told me these are "old-fashioned." What's the modern way?

— Refactoring in Rotterdam

---

## Marilyn Responds:

Your colleague is correct, and the distinction they are pointing to is one of the most important in modern CMake: the difference between **directory-based** and **target-based** commands.

The old commands — \`include_directories()\`, \`link_libraries()\`, \`add_definitions()\` — apply settings to *everything* in the current directory and all subdirectories. They are a blunt instrument. They pollute the entire build with settings that may only be relevant to one component.

The modern commands — \`target_include_directories()\`, \`target_link_libraries()\`, \`target_compile_definitions()\` — apply settings to a *specific target*. They are a scalpel.

---

## The Target: The Fundamental Unit

In modern CMake, everything revolves around **targets**. A target is a named build artifact:

\`\`\`cmake
add_executable(myapp main.cpp)       # An executable
add_library(mylib STATIC lib.cpp)    # A static library
add_library(mylib SHARED lib.cpp)    # A shared/dynamic library
add_library(mylib INTERFACE)         # A header-only library
\`\`\`

Once you have a target, you configure it with target-specific commands:

\`\`\`cmake
target_include_directories(mylib
  PUBLIC  include/          # Consumers also get this include path
  PRIVATE src/              # Only mylib itself gets this
  INTERFACE include/        # Only consumers get this, not mylib itself
)

target_compile_definitions(mylib
  PRIVATE MYLIB_INTERNAL=1
  PUBLIC  MYLIB_VERSION=2
)

target_link_libraries(myapp
  PRIVATE mylib             # myapp links to mylib; consumers of myapp don't
)
\`\`\`

---

## The Visibility Keywords: PUBLIC, PRIVATE, INTERFACE

This is the concept that unlocks everything:

| Keyword | Applies to target itself? | Propagates to consumers? |
|---|---|---|
| PRIVATE | Yes | No |
| PUBLIC | Yes | Yes |
| INTERFACE | No | Yes |

When you say \`target_link_libraries(myapp PRIVATE mylib)\`, you are saying: "myapp links against mylib, but anything that links against myapp does NOT automatically get mylib."

When you say \`target_link_libraries(myapp PUBLIC mylib)\`, you are saying: "myapp links against mylib, AND anything that links against myapp also gets mylib."

This is **transitive dependency management**. Get it right, and your build graph is clean. Get it wrong, and you have a tangled mess of implicit dependencies.`,

    cruciblePrompt: `**The Crucible: Modern Target-Based CMake**

You have a project with:
- A static library \`mathlib\` built from \`math/add.cpp\` and \`math/multiply.cpp\`
- The library's public headers are in \`math/include/\`
- An executable \`calculator\` built from \`app/main.cpp\`
- The executable uses the mathlib library

Write a \`CMakeLists.txt\` that:
1. Sets minimum CMake version to 3.20 and project name to "Calculator"
2. Creates the \`mathlib\` static library with the correct include directories
3. Creates the \`calculator\` executable
4. Links \`calculator\` to \`mathlib\` with the correct visibility keyword
5. Ensures consumers of \`calculator\` do NOT automatically inherit \`mathlib\`'s include paths`,

    crucibleSample: `\`\`\`cmake
cmake_minimum_required(VERSION 3.20)
project(Calculator VERSION 1.0)

# Create the library
add_library(mathlib STATIC
  math/add.cpp
  math/multiply.cpp
)

# PUBLIC: both mathlib AND its consumers get this include path
target_include_directories(mathlib
  PUBLIC math/include
)

# Create the executable
add_executable(calculator app/main.cpp)

# PRIVATE: calculator links mathlib, but consumers of calculator do not
target_link_libraries(calculator PRIVATE mathlib)
\`\`\``,

    imprintContent: `## The Imprint: Targets Are Everything

Picture a city. Each building is a target. Roads between buildings are dependencies. 

The **visibility keywords** are the traffic rules:
- **PRIVATE**: A private road. Only this building uses it.
- **PUBLIC**: A public road. This building AND everyone who visits it can use it.
- **INTERFACE**: A road that only visitors use — the building itself takes a different route.

When you use \`target_link_libraries()\` with the correct visibility, you are drawing the city map. Get the roads right, and traffic flows. Get them wrong, and you have gridlock.

**The rule of thumb:** Default to PRIVATE. Use PUBLIC only when consumers genuinely need the dependency. Use INTERFACE for header-only libraries.`,
  },

  {
    moduleNumber: 4,
    track: "foundations",
    title: "The CMake Cache",
    subtitle: "Variables, persistence, and the configuration conversation",
    estimatedMinutes: 15,
    sparkContent: `## Dear Marilyn,

I run \`cmake -DSOME_OPTION=ON\` and it works the first time. But then I run cmake again without that flag and my option disappears. Other times I change a variable and CMake seems to ignore it. The cache is a mystery to me.

— Baffled in Boston

---

## Marilyn Responds:

The CMake cache is not a mystery. It is a *conversation*. Once you understand the conversation, the cache becomes your most powerful ally.

When CMake runs for the first time, it creates a file called \`CMakeCache.txt\` in your build directory. This file is the **persistent memory** of your configuration. Every variable you set with \`-D\` is stored here. Every variable CMake detects (compiler path, library location) is stored here.

On subsequent runs, CMake reads the cache first, then re-runs your \`CMakeLists.txt\`. Variables already in the cache are NOT overwritten by \`set()\` calls in your CMakeLists.txt — unless you explicitly use the \`CACHE\` keyword.

---

## Cache Variables vs. Normal Variables

\`\`\`cmake
# Normal variable — exists only during this cmake run
set(MY_VAR "hello")

# Cache variable — persists between cmake runs, shown in cmake-gui
set(MY_OPTION ON CACHE BOOL "Enable my feature")

# Cache variable with FORCE — overwrites existing cache value
set(MY_OPTION ON CACHE BOOL "Enable my feature" FORCE)
\`\`\`

The types for cache variables are: \`BOOL\`, \`STRING\`, \`FILEPATH\`, \`PATH\`, and \`INTERNAL\`.

---

## The -D Flag

The \`-D\` flag on the command line sets a cache variable:

\`\`\`bash
cmake -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=OFF -S . -B build
\`\`\`

This is equivalent to editing \`CMakeCache.txt\` directly, but safer. The value persists in the cache for all subsequent runs.

---

## Inspecting the Cache

\`\`\`bash
cmake -L build/           # List all non-advanced cache variables
cmake -LA build/          # List ALL cache variables (including advanced)
cmake -LH build/          # List with help strings
\`\`\`

Or open \`cmake-gui\` and point it at your build directory for a visual interface.`,

    cruciblePrompt: `**The Crucible: Cache Variables**

You are writing a library that can optionally build with SIMD support. Write the CMake code that:

1. Declares a cache variable \`MYLIB_ENABLE_SIMD\` of type BOOL, defaulting to OFF, with the help string "Enable SIMD optimizations"
2. Uses an \`if()\` block to conditionally add \`-DUSE_SIMD\` as a compile definition to a target named \`mylib\` when SIMD is enabled
3. Write the command-line invocation that would enable SIMD during configuration`,

    crucibleSample: `\`\`\`cmake
# In CMakeLists.txt:
option(MYLIB_ENABLE_SIMD "Enable SIMD optimizations" OFF)
# option() is shorthand for: set(MYLIB_ENABLE_SIMD OFF CACHE BOOL "Enable SIMD optimizations")

if(MYLIB_ENABLE_SIMD)
  target_compile_definitions(mylib PRIVATE USE_SIMD)
endif()
\`\`\`

**Command-line invocation:**
\`\`\`bash
cmake -DMYLIB_ENABLE_SIMD=ON -S . -B build
\`\`\`

Note: \`option()\` is the idiomatic way to declare a BOOL cache variable. It is equivalent to \`set(VAR OFF CACHE BOOL "...")\` but more readable.`,

    imprintContent: `## The Imprint: The Cache Is Memory

Imagine CMake as a detective. The first time it visits your project, it investigates everything: your compiler, your libraries, your options. It writes all its findings in a notebook called \`CMakeCache.txt\`.

The next time it visits, it reads the notebook first. It doesn't re-investigate things it already knows — unless you force it to.

**The three cache rules:**
1. \`-D\` on the command line writes to the notebook.
2. \`set(VAR value CACHE TYPE "help")\` writes to the notebook only if the variable isn't already there.
3. \`set(VAR value CACHE TYPE "help" FORCE)\` always overwrites the notebook.

Delete the build directory to start with a blank notebook.`,
  },

  {
    moduleNumber: 5,
    track: "foundations",
    title: "Key Concepts: Policies, Properties, and Scope",
    subtitle: "The invisible rules that govern every CMake build",
    estimatedMinutes: 20,
    sparkContent: `## Dear Marilyn,

I keep seeing warnings about "CMP0077" and "CMP0048" in my builds. What are CMake policies and why do they exist? Also, I'm confused about variable scope — sometimes my variables seem to disappear.

— Perplexed in Portland

---

## Marilyn Responds:

CMake has been evolving for over two decades. During that time, the CMake team has had to change the meaning of certain behaviors — sometimes dramatically. But they could not simply break every existing project that relied on the old behavior.

Their solution was **policies**: a versioned compatibility system that lets old projects keep their old behavior while new projects adopt improved behavior.

---

## Policies: Versioned Behavior

Every CMake policy has a name like \`CMP0077\` and two states: \`OLD\` (the legacy behavior) and \`NEW\` (the modern behavior).

When you set \`cmake_minimum_required(VERSION 3.20)\`, CMake automatically sets all policies introduced before version 3.20 to \`NEW\`. This is why you should always set the minimum version as high as your oldest supported platform allows.

\`\`\`cmake
# Explicitly set a policy (rarely needed if min version is set correctly)
cmake_policy(SET CMP0077 NEW)
\`\`\`

**The practical rule:** Set \`cmake_minimum_required(VERSION X.Y)\` to the newest version you can. This silences most policy warnings.

---

## Variable Scope

CMake has a hierarchical scope system:

\`\`\`cmake
# Function scope — variables are local to the function
function(my_func)
  set(LOCAL_VAR "hello")        # Only visible inside my_func
  set(PARENT_VAR "world" PARENT_SCOPE)  # Visible in caller
endfunction()

# Directory scope — variables are visible in current dir and subdirs
set(DIR_VAR "value")

# add_subdirectory() creates a child scope
add_subdirectory(subdir)  # subdir sees DIR_VAR, but changes don't propagate up
\`\`\`

**The scope hierarchy:** Function → Directory → Cache → Environment

---

## Properties: Per-Object Settings

Properties are settings attached to specific objects (targets, directories, source files):

\`\`\`cmake
# Set a property on a target
set_target_properties(mylib PROPERTIES
  CXX_STANDARD 17
  CXX_STANDARD_REQUIRED ON
  POSITION_INDEPENDENT_CODE ON
)

# Get a property
get_target_property(MYLIB_TYPE mylib TYPE)
message(STATUS "Library type: \${MYLIB_TYPE}")
\`\`\`

Properties are the fine-grained control mechanism. Cache variables are the coarse-grained configuration mechanism. Know when to use each.`,

    cruciblePrompt: `**The Crucible: Scope and Properties**

You have a function \`configure_target\` that should:
1. Accept a target name as an argument
2. Set C++17 as the required standard on that target
3. Enable position-independent code on that target
4. Set a variable \`CONFIGURED\` to \`TRUE\` in the *caller's* scope

Write the complete function definition. Then write the call to configure a target named \`mylib\`.`,

    crucibleSample: `\`\`\`cmake
function(configure_target TARGET_NAME)
  set_target_properties(\${TARGET_NAME} PROPERTIES
    CXX_STANDARD 17
    CXX_STANDARD_REQUIRED ON
    POSITION_INDEPENDENT_CODE ON
  )
  set(CONFIGURED TRUE PARENT_SCOPE)
endfunction()

# Usage:
add_library(mylib STATIC lib.cpp)
configure_target(mylib)

if(CONFIGURED)
  message(STATUS "mylib was configured successfully")
endif()
\`\`\``,

    imprintContent: `## The Imprint: Three Layers of Control

Think of CMake's control system as three concentric circles:

**Outer circle — Policies:** The rules of the game. Set by \`cmake_minimum_required()\`. Touch them rarely.

**Middle circle — Cache Variables:** The configuration knobs. Set by \`-D\` flags or \`option()\`. These are what users of your build system interact with.

**Inner circle — Properties:** The fine-grained settings on specific targets, files, and directories. These are what you, the CMake author, use to precisely control the build.

Understanding which circle to use for which problem is the mark of a CMake expert.`,
  },

  // Track: Build System (6-10)
  {
    moduleNumber: 6,
    track: "build_system",
    title: "Modules: Reusable Build Logic",
    subtitle: "Find modules, utility modules, and writing your own",
    estimatedMinutes: 15,
    sparkContent: `## Dear Marilyn,

I see \`include(GNUInstallDirs)\` and \`include(CMakePackageConfigHelpers)\` in many CMakeLists.txt files. What are these? And how do I write my own reusable CMake code?

— Modular in Munich

---

## Marilyn Responds:

CMake ships with a rich standard library of modules — reusable CMake scripts that provide common functionality. They fall into two categories:

**Find Modules** (e.g., \`FindOpenSSL\`, \`FindZLIB\`): These locate external libraries on the system.

**Utility Modules** (e.g., \`GNUInstallDirs\`, \`CMakePackageConfigHelpers\`): These provide helper functions and macros.

---

## Using Standard Modules

\`\`\`cmake
include(GNUInstallDirs)
# Now you have: CMAKE_INSTALL_BINDIR, CMAKE_INSTALL_LIBDIR, etc.

include(CMakePackageConfigHelpers)
# Now you have: configure_package_config_file(), write_basic_package_version_file()

include(CheckCXXCompilerFlag)
# Now you have: check_cxx_compiler_flag()
\`\`\`

---

## Writing Your Own Modules

Place your module in a directory and add it to \`CMAKE_MODULE_PATH\`:

\`\`\`cmake
# In your top-level CMakeLists.txt:
list(APPEND CMAKE_MODULE_PATH "\${CMAKE_CURRENT_SOURCE_DIR}/cmake")

# Then in cmake/MyHelpers.cmake:
function(add_sanitized_executable TARGET)
  add_executable(\${TARGET} \${ARGN})
  target_compile_options(\${TARGET} PRIVATE -fsanitize=address)
  target_link_options(\${TARGET} PRIVATE -fsanitize=address)
endfunction()
\`\`\`

---

## The Module Search Path

When you call \`include(SomeName)\` or \`find_package(SomeName)\`, CMake searches:
1. Directories in \`CMAKE_MODULE_PATH\` (your custom modules first)
2. CMake's built-in module directory

This allows you to override built-in Find modules with your own improved versions.`,

    cruciblePrompt: `**The Crucible: Writing a CMake Module**

Create a CMake module file \`cmake/CompilerWarnings.cmake\` that:
1. Defines a function \`enable_warnings\` that takes a target name
2. For GCC and Clang, adds \`-Wall -Wextra -Wpedantic\` to the target's PRIVATE compile options
3. For MSVC, adds \`/W4\` instead

Then show how to use this module in a top-level CMakeLists.txt.`,

    crucibleSample: `**cmake/CompilerWarnings.cmake:**
\`\`\`cmake
function(enable_warnings TARGET_NAME)
  if(MSVC)
    target_compile_options(\${TARGET_NAME} PRIVATE /W4)
  else()
    target_compile_options(\${TARGET_NAME} PRIVATE
      -Wall -Wextra -Wpedantic
    )
  endif()
endfunction()
\`\`\`

**In CMakeLists.txt:**
\`\`\`cmake
cmake_minimum_required(VERSION 3.20)
project(MyProject)

list(APPEND CMAKE_MODULE_PATH "\${CMAKE_CURRENT_SOURCE_DIR}/cmake")
include(CompilerWarnings)

add_executable(myapp main.cpp)
enable_warnings(myapp)
\`\`\``,

    imprintContent: `## The Imprint: Don't Repeat Yourself

Every time you copy-paste CMake code between projects, you are creating a maintenance nightmare. CMake modules are the solution.

The pattern is always the same:
1. Write the reusable logic in a \`.cmake\` file
2. Add its directory to \`CMAKE_MODULE_PATH\`
3. \`include()\` it wherever you need it

The CMake standard library is enormous. Before writing your own module, search the CMake documentation — there is likely already a module for what you need.`,
  },

  {
    moduleNumber: 7,
    track: "build_system",
    title: "Installing Files",
    subtitle: "The install() command and deployment destinations",
    estimatedMinutes: 15,
    sparkContent: `## Dear Marilyn,

I can build my library, but I don't know how to make it installable. How does \`cmake --install\` work, and what is \`GNUInstallDirs\`?

— Installing in Istanbul

---

## Marilyn Responds:

Installation is the act of taking your build artifacts and placing them in a location where other software can find and use them. CMake's \`install()\` command is the mechanism for declaring *what* goes *where*.

---

## The install() Command

\`\`\`cmake
# Install an executable
install(TARGETS myapp
  RUNTIME DESTINATION bin
)

# Install a library (static and shared)
install(TARGETS mylib
  ARCHIVE DESTINATION lib      # Static libraries (.a, .lib)
  LIBRARY DESTINATION lib      # Shared libraries (.so, .dylib)
  RUNTIME DESTINATION bin      # DLLs on Windows
)

# Install header files
install(DIRECTORY include/
  DESTINATION include
)

# Install a specific file
install(FILES README.md
  DESTINATION share/doc/myproject
)
\`\`\`

---

## GNUInstallDirs: Platform-Correct Paths

Different platforms have different conventions for where things go. \`GNUInstallDirs\` provides standard variables:

\`\`\`cmake
include(GNUInstallDirs)

install(TARGETS mylib
  ARCHIVE DESTINATION \${CMAKE_INSTALL_LIBDIR}
  LIBRARY DESTINATION \${CMAKE_INSTALL_LIBDIR}
  RUNTIME DESTINATION \${CMAKE_INSTALL_BINDIR}
)

install(DIRECTORY include/
  DESTINATION \${CMAKE_INSTALL_INCLUDEDIR}
)
\`\`\`

| Variable | Linux | macOS | Windows |
|---|---|---|---|
| CMAKE_INSTALL_BINDIR | bin | bin | bin |
| CMAKE_INSTALL_LIBDIR | lib | lib | lib |
| CMAKE_INSTALL_INCLUDEDIR | include | include | include |
| CMAKE_INSTALL_DATADIR | share | share | share |

---

## The CMAKE_INSTALL_PREFIX

The installation prefix is the root of the installation tree:

\`\`\`bash
cmake --install build --prefix /usr/local
cmake --install build --prefix /opt/myapp
\`\`\`

The default is \`/usr/local\` on Unix and \`C:/Program Files/ProjectName\` on Windows.`,

    cruciblePrompt: `**The Crucible: Complete Installation Rules**

You have a project with:
- An executable \`myapp\`
- A shared library \`mylib\`
- Public headers in \`include/mylib/\`
- A \`README.md\` file

Write the complete installation rules using \`GNUInstallDirs\`. Then write the command to install the project to \`/opt/myapp\`.`,

    crucibleSample: `\`\`\`cmake
include(GNUInstallDirs)

install(TARGETS myapp mylib
  RUNTIME DESTINATION \${CMAKE_INSTALL_BINDIR}
  LIBRARY DESTINATION \${CMAKE_INSTALL_LIBDIR}
  ARCHIVE DESTINATION \${CMAKE_INSTALL_LIBDIR}
)

install(DIRECTORY include/
  DESTINATION \${CMAKE_INSTALL_INCLUDEDIR}
)

install(FILES README.md
  DESTINATION \${CMAKE_INSTALL_DOCDIR}
)
\`\`\`

**Install command:**
\`\`\`bash
cmake --install build --prefix /opt/myapp
\`\`\``,

    imprintContent: `## The Imprint: The Three Destinations

Every installed file has a destination. Remember the three most important:

- **bin** → Executables and DLLs (things users run)
- **lib** → Libraries (things developers link against)
- **include** → Headers (things developers compile against)

Always use \`GNUInstallDirs\` variables instead of hardcoding paths. The platform knows where things belong better than you do.`,
  },

  {
    moduleNumber: 8,
    track: "build_system",
    title: "System Inspection and Finding Packages",
    subtitle: "Detecting capabilities and locating dependencies",
    estimatedMinutes: 20,
    sparkContent: `## Dear Marilyn,

My project needs OpenSSL and Boost. Sometimes they're installed in standard locations, sometimes not. How do I find them reliably with CMake?

— Searching in Singapore

---

## Marilyn Responds:

Finding external dependencies is one of the most common CMake tasks, and CMake provides two complementary mechanisms: **Find Modules** for legacy packages and **Config Packages** for modern CMake-aware packages.

---

## find_package(): The Universal Interface

\`\`\`cmake
# Find OpenSSL (uses a Find Module)
find_package(OpenSSL REQUIRED)
target_link_libraries(myapp PRIVATE OpenSSL::SSL OpenSSL::Crypto)

# Find Boost (uses a Find Module)
find_package(Boost 1.70 REQUIRED COMPONENTS filesystem system)
target_link_libraries(myapp PRIVATE Boost::filesystem Boost::system)

# Find a CMake-aware package (uses Config mode)
find_package(fmt REQUIRED)
target_link_libraries(myapp PRIVATE fmt::fmt)
\`\`\`

The \`REQUIRED\` keyword causes CMake to fail if the package is not found. Without it, you must check the \`PackageName_FOUND\` variable.

---

## Two Modes: Module vs. Config

| Mode | How it works | When to use |
|---|---|---|
| Module mode | CMake runs \`FindXxx.cmake\` | Legacy packages without CMake support |
| Config mode | Package provides \`XxxConfig.cmake\` | Modern CMake-aware packages |

CMake tries Module mode first, then Config mode (unless you specify \`CONFIG\` or \`MODULE\`).

---

## System Inspection

For fine-grained capability detection:

\`\`\`cmake
include(CheckCXXCompilerFlag)
check_cxx_compiler_flag("-std=c++17" COMPILER_SUPPORTS_CXX17)

include(CheckIncludeFileCXX)
check_include_file_cxx("optional" HAVE_OPTIONAL)

include(CheckFunctionExists)
check_function_exists(getaddrinfo HAVE_GETADDRINFO)
\`\`\`

These checks write results to the cache, so they only run once.`,

    cruciblePrompt: `**The Crucible: Finding and Using a Package**

Write a CMakeLists.txt snippet that:
1. Optionally finds the \`zlib\` package (not REQUIRED)
2. If found, adds a compile definition \`HAVE_ZLIB=1\` to a target \`myapp\`
3. If found, links \`myapp\` against zlib
4. Prints a status message indicating whether zlib was found`,

    crucibleSample: `\`\`\`cmake
find_package(ZLIB)

if(ZLIB_FOUND)
  message(STATUS "zlib found: \${ZLIB_VERSION_STRING}")
  target_compile_definitions(myapp PRIVATE HAVE_ZLIB=1)
  target_link_libraries(myapp PRIVATE ZLIB::ZLIB)
else()
  message(STATUS "zlib not found — building without compression support")
endif()
\`\`\``,

    imprintContent: `## The Imprint: Imported Targets Are Your Friends

Modern CMake packages expose **imported targets** — named targets like \`OpenSSL::SSL\` or \`ZLIB::ZLIB\` that carry all the necessary include paths, compile flags, and link libraries automatically.

When you use \`target_link_libraries(myapp PRIVATE OpenSSL::SSL)\`, you get *everything* OpenSSL needs — you don't have to manually specify include directories or link flags. The imported target knows what it needs.

Always prefer imported targets over the old-style \`Xxx_LIBRARIES\` and \`Xxx_INCLUDE_DIRS\` variables.`,
  },

  {
    moduleNumber: 9,
    track: "build_system",
    title: "Custom Commands and Code Generation",
    subtitle: "Extending the build with custom steps",
    estimatedMinutes: 15,
    sparkContent: `## Dear Marilyn,

My project needs to generate C++ source files from a schema file before compilation. How do I integrate code generation into my CMake build?

— Generating in Geneva

---

## Marilyn Responds:

Code generation is one of the most powerful patterns in modern software development — and CMake handles it elegantly with \`add_custom_command()\` and \`add_custom_target()\`.

---

## add_custom_command(): File Generation

Use this to generate files that are inputs to other build steps:

\`\`\`cmake
add_custom_command(
  OUTPUT \${CMAKE_CURRENT_BINARY_DIR}/generated.cpp
  COMMAND python3 \${CMAKE_CURRENT_SOURCE_DIR}/codegen.py
          --input \${CMAKE_CURRENT_SOURCE_DIR}/schema.json
          --output \${CMAKE_CURRENT_BINARY_DIR}/generated.cpp
  DEPENDS \${CMAKE_CURRENT_SOURCE_DIR}/schema.json
          \${CMAKE_CURRENT_SOURCE_DIR}/codegen.py
  COMMENT "Generating C++ from schema"
)

# Use the generated file in a target
add_executable(myapp
  main.cpp
  \${CMAKE_CURRENT_BINARY_DIR}/generated.cpp
)
\`\`\`

The \`DEPENDS\` list tells CMake when to re-run the command. If any dependency changes, the output is regenerated.

---

## add_custom_target(): Always-Run Steps

Use this for steps that don't produce files (or whose output you want to always regenerate):

\`\`\`cmake
add_custom_target(generate_docs
  COMMAND doxygen \${CMAKE_CURRENT_SOURCE_DIR}/Doxyfile
  WORKING_DIRECTORY \${CMAKE_CURRENT_SOURCE_DIR}
  COMMENT "Generating documentation"
)

# Make another target depend on this
add_dependencies(myapp generate_docs)
\`\`\`

---

## PRE_BUILD, PRE_LINK, POST_BUILD

You can attach commands to specific build phases of a target:

\`\`\`cmake
add_custom_command(TARGET myapp POST_BUILD
  COMMAND \${CMAKE_COMMAND} -E copy_if_different
    \${CMAKE_CURRENT_SOURCE_DIR}/config.json
    \$<TARGET_FILE_DIR:myapp>/config.json
  COMMENT "Copying config file"
)
\`\`\``,

    cruciblePrompt: `**The Crucible: Integrating a Code Generator**

You have a Python script \`tools/generate_version.py\` that reads \`version.txt\` and produces \`src/version_generated.h\`. Write the CMake code to:

1. Run the generator script as part of the build
2. Ensure it re-runs when either \`version.txt\` or the script changes
3. Include the generated header in a target named \`myapp\`
4. Ensure the build directory is in the include path so the generated header can be found`,

    crucibleSample: `\`\`\`cmake
add_custom_command(
  OUTPUT \${CMAKE_CURRENT_BINARY_DIR}/src/version_generated.h
  COMMAND python3
    \${CMAKE_CURRENT_SOURCE_DIR}/tools/generate_version.py
    --input \${CMAKE_CURRENT_SOURCE_DIR}/version.txt
    --output \${CMAKE_CURRENT_BINARY_DIR}/src/version_generated.h
  DEPENDS
    \${CMAKE_CURRENT_SOURCE_DIR}/version.txt
    \${CMAKE_CURRENT_SOURCE_DIR}/tools/generate_version.py
  COMMENT "Generating version header"
)

add_executable(myapp
  src/main.cpp
  \${CMAKE_CURRENT_BINARY_DIR}/src/version_generated.h
)

target_include_directories(myapp PRIVATE
  \${CMAKE_CURRENT_BINARY_DIR}/src
)
\`\`\``,

    imprintContent: `## The Imprint: The Build Graph

Every CMake build is a directed acyclic graph (DAG). Nodes are files and targets. Edges are dependencies. CMake's job is to traverse this graph in the correct order.

\`add_custom_command()\` adds new nodes and edges to this graph. The \`DEPENDS\` list defines the incoming edges — what must exist before this command runs. The \`OUTPUT\` list defines the outgoing edges — what this command produces.

When you understand the build as a graph, custom commands become obvious: you are simply adding new nodes to the graph.`,
  },

  {
    moduleNumber: 10,
    track: "build_system",
    title: "Converting Existing Systems and Cross Compiling",
    subtitle: "Migration strategies and toolchain files",
    estimatedMinutes: 20,
    sparkContent: `## Dear Marilyn,

I have a large project using hand-written Makefiles. My team wants to migrate to CMake, but the project is enormous and we can't stop development to do a big-bang migration. Is there a gradual approach?

— Migrating in Melbourne

---

## Marilyn Responds:

The gradual migration is not only possible — it is the only sane approach for large projects. The key insight is that CMake can coexist with your existing build system during the transition.

---

## The Migration Strategy

**Phase 1: Inventory.** Before writing a single line of CMake, document every component in your existing build:
- What executables are produced?
- What libraries exist?
- What are the dependencies between them?
- What compiler flags are used?
- What external libraries are required?

**Phase 2: Leaf-first migration.** Start with the components that have no internal dependencies (the "leaves" of your dependency tree). Convert them to CMake first.

**Phase 3: Work inward.** Once leaves are converted, convert the components that depend only on converted leaves.

**Phase 4: Root last.** The top-level executable or library is converted last.

---

## Cross Compiling with Toolchain Files

Cross compilation means building for a different platform than the one you're building on (e.g., building ARM binaries on an x86 machine).

CMake handles this with **toolchain files**:

\`\`\`cmake
# toolchain-arm.cmake
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR arm)

set(CMAKE_C_COMPILER arm-linux-gnueabihf-gcc)
set(CMAKE_CXX_COMPILER arm-linux-gnueabihf-g++)

set(CMAKE_FIND_ROOT_PATH /opt/arm-sysroot)
set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
\`\`\`

\`\`\`bash
cmake -DCMAKE_TOOLCHAIN_FILE=toolchain-arm.cmake -S . -B build-arm
\`\`\`

---

## CMake Presets

For managing multiple configurations (debug, release, cross-compile), use \`CMakePresets.json\`:

\`\`\`json
{
  "version": 3,
  "configurePresets": [
    {
      "name": "arm-release",
      "toolchainFile": "toolchain-arm.cmake",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release"
      }
    }
  ]
}
\`\`\`

\`\`\`bash
cmake --preset arm-release
\`\`\``,

    cruciblePrompt: `**The Crucible: Toolchain File**

You are cross-compiling for a Raspberry Pi (ARM Cortex-A72, 64-bit, running Linux). The cross-compiler is at \`/opt/rpi-toolchain/bin/aarch64-linux-gnu-gcc\` and \`aarch64-linux-gnu-g++\`. The sysroot is at \`/opt/rpi-sysroot\`.

Write a complete toolchain file \`toolchain-rpi4.cmake\` and the cmake command to use it.`,

    crucibleSample: `**toolchain-rpi4.cmake:**
\`\`\`cmake
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR aarch64)

set(CMAKE_C_COMPILER /opt/rpi-toolchain/bin/aarch64-linux-gnu-gcc)
set(CMAKE_CXX_COMPILER /opt/rpi-toolchain/bin/aarch64-linux-gnu-g++)

set(CMAKE_SYSROOT /opt/rpi-sysroot)
set(CMAKE_FIND_ROOT_PATH /opt/rpi-sysroot)

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)
\`\`\`

**Build command:**
\`\`\`bash
cmake -DCMAKE_TOOLCHAIN_FILE=toolchain-rpi4.cmake -DCMAKE_BUILD_TYPE=Release -S . -B build-rpi4
cmake --build build-rpi4
\`\`\``,

    imprintContent: `## The Imprint: The Toolchain Is the Target

When cross-compiling, you are not building for the machine in front of you. You are building for a machine that may be thousands of miles away, running a different OS, with a different CPU architecture.

The toolchain file is CMake's way of saying: "Forget everything you know about this machine. Here is the machine we are building for."

The three critical settings in any toolchain file:
1. \`CMAKE_SYSTEM_NAME\` — the target OS
2. \`CMAKE_C_COMPILER\` / \`CMAKE_CXX_COMPILER\` — the cross-compiler
3. \`CMAKE_FIND_ROOT_PATH\` — where to find libraries for the target`,
  },

  // Track: Advanced (11-15)
  {
    moduleNumber: 11,
    track: "advanced",
    title: "Packaging with CPack",
    subtitle: "Creating distributable packages for every platform",
    estimatedMinutes: 20,
    sparkContent: `## Dear Marilyn,

I've built my software and it works. Now I need to distribute it. I need a .deb for Linux, an .exe installer for Windows, and a .dmg for macOS. Do I really need three separate packaging systems?

— Packaging in Prague

---

## Marilyn Responds:

No. You need one: **CPack**.

CPack is the packaging component of the CMake family. It reads your CMake install rules and generates packages in whatever format you need — all from the same configuration.

---

## Basic CPack Configuration

\`\`\`cmake
# At the end of your CMakeLists.txt, after all install() calls:
set(CPACK_PACKAGE_NAME "MyApp")
set(CPACK_PACKAGE_VERSION "1.0.0")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "My awesome application")
set(CPACK_PACKAGE_VENDOR "My Company")

# Include CPack — this must come AFTER all set(CPACK_*) calls
include(CPack)
\`\`\`

Then build and package:
\`\`\`bash
cmake -S . -B build
cmake --build build
cd build && cpack
\`\`\`

---

## Generators: One Config, Many Formats

\`\`\`bash
cpack -G DEB     # Debian package (.deb)
cpack -G RPM     # RPM package (.rpm)
cpack -G NSIS    # Windows installer (.exe)
cpack -G WIX     # Windows MSI installer
cpack -G DragNDrop  # macOS .dmg
cpack -G TGZ     # Tarball (.tar.gz)
cpack -G ZIP     # ZIP archive
\`\`\`

---

## Component-Based Packaging

For complex projects, you can create separate packages for different components:

\`\`\`cmake
install(TARGETS myapp
  RUNTIME DESTINATION bin
  COMPONENT runtime
)

install(TARGETS mylib
  LIBRARY DESTINATION lib
  COMPONENT development
)

install(DIRECTORY include/
  DESTINATION include
  COMPONENT development
)

set(CPACK_COMPONENTS_ALL runtime development)
\`\`\`

\`\`\`bash
cpack -G DEB --config CPackConfig.cmake -D CPACK_COMPONENTS_ALL=runtime
\`\`\``,

    cruciblePrompt: `**The Crucible: Complete CPack Setup**

You have a project "DataViz" version 2.1.0 by "Analytics Corp". It has:
- An executable component (runtime)
- A library + headers component (development)

Write the complete CPack configuration that:
1. Sets all required package metadata
2. Defines the two components with descriptions
3. Configures a DEB package with the correct section and priority
4. Write the commands to build and create both a DEB and a ZIP package`,

    crucibleSample: `\`\`\`cmake
set(CPACK_PACKAGE_NAME "DataViz")
set(CPACK_PACKAGE_VERSION "2.1.0")
set(CPACK_PACKAGE_VENDOR "Analytics Corp")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "Data visualization toolkit")
set(CPACK_PACKAGE_CONTACT "support@analyticscorp.com")

# Component definitions
set(CPACK_COMPONENT_RUNTIME_DISPLAY_NAME "DataViz Runtime")
set(CPACK_COMPONENT_RUNTIME_DESCRIPTION "The DataViz executable")
set(CPACK_COMPONENT_DEVELOPMENT_DISPLAY_NAME "DataViz Development")
set(CPACK_COMPONENT_DEVELOPMENT_DESCRIPTION "Headers and libraries for development")
set(CPACK_COMPONENTS_ALL runtime development)

# DEB-specific settings
set(CPACK_DEBIAN_PACKAGE_SECTION "utils")
set(CPACK_DEBIAN_PACKAGE_PRIORITY "optional")

include(CPack)
\`\`\`

**Build and package commands:**
\`\`\`bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
cd build
cpack -G DEB
cpack -G ZIP
\`\`\``,

    imprintContent: `## The Imprint: Package Once, Deploy Everywhere

CPack is the final step in the CMake workflow: **Configure → Build → Install → Package**.

The genius of CPack is that it reuses your \`install()\` rules. You define *what* gets installed once, and CPack uses that definition to create packages for every platform.

The package is the artifact you ship. Everything before it — the CMakeLists.txt, the build, the install rules — exists to produce that artifact.`,
  },

  {
    moduleNumber: 12,
    track: "advanced",
    title: "Testing with CMake and CTest",
    subtitle: "Registering, running, and analyzing tests",
    estimatedMinutes: 20,
    sparkContent: `## Dear Marilyn,

I have unit tests in my project. Right now I run them manually. How do I integrate them with CMake so they run automatically?

— Testing in Tokyo

---

## Marilyn Responds:

Testing is not optional. It is the evidence that your software does what you claim it does. CMake's testing component, **CTest**, makes it trivial to register and run tests as part of your build process.

---

## Enabling Testing

\`\`\`cmake
# In your top-level CMakeLists.txt:
enable_testing()

# Or equivalently, include CTest:
include(CTest)
\`\`\`

---

## Registering Tests

\`\`\`cmake
# Simple test — just run an executable
add_test(NAME MyTest COMMAND mytest_executable)

# Test with arguments
add_test(NAME ParseTest COMMAND myparser --input test_data.json)

# Test with working directory
add_test(NAME IntegrationTest
  COMMAND myapp --config test.cfg
  WORKING_DIRECTORY \${CMAKE_CURRENT_SOURCE_DIR}/test_data
)

# Test with expected return code
set_tests_properties(MyTest PROPERTIES WILL_FAIL TRUE)
\`\`\`

---

## Running Tests

\`\`\`bash
# Run all tests
ctest --test-dir build

# Run with verbose output
ctest --test-dir build -V

# Run only tests matching a pattern
ctest --test-dir build -R "Parse.*"

# Run tests in parallel
ctest --test-dir build -j 4

# Run with timeout
ctest --test-dir build --timeout 30
\`\`\`

---

## Test Properties

\`\`\`cmake
set_tests_properties(MyTest PROPERTIES
  TIMEOUT 30                    # Fail if test takes more than 30 seconds
  PASS_REGULAR_EXPRESSION "PASS"  # Test passes if output matches
  FAIL_REGULAR_EXPRESSION "ERROR" # Test fails if output matches
  LABELS "unit;fast"            # For filtering
  ENVIRONMENT "MY_VAR=value"    # Set environment variables
)
\`\`\`

---

## GoogleTest Integration

\`\`\`cmake
find_package(GTest REQUIRED)
include(GoogleTest)

add_executable(mytest test_main.cpp)
target_link_libraries(mytest PRIVATE GTest::gtest_main)

gtest_discover_tests(mytest)  # Auto-discovers all TEST() and TEST_F() macros
\`\`\``,

    cruciblePrompt: `**The Crucible: Complete Test Setup**

You have a project with:
- A library \`mathlib\`
- A test executable \`mathlib_tests\` that uses GoogleTest
- Tests should be labeled "unit"
- Tests should timeout after 60 seconds

Write the complete CMake code to:
1. Enable testing
2. Build the test executable (assume GTest is already found)
3. Register the tests with auto-discovery
4. Set the timeout and label properties
5. Write the ctest command to run only "unit" tests in parallel with 4 jobs`,

    crucibleSample: `\`\`\`cmake
enable_testing()
include(GoogleTest)

add_executable(mathlib_tests
  tests/test_add.cpp
  tests/test_multiply.cpp
)

target_link_libraries(mathlib_tests PRIVATE
  mathlib
  GTest::gtest_main
)

gtest_discover_tests(mathlib_tests
  PROPERTIES
    TIMEOUT 60
    LABELS "unit"
)
\`\`\`

**CTest command:**
\`\`\`bash
ctest --test-dir build -L unit -j 4
\`\`\``,

    imprintContent: `## The Imprint: Tests Are First-Class Citizens

In a properly structured CMake project, tests are not an afterthought. They are built and run as part of the normal development cycle.

The command \`cmake --build build && ctest --test-dir build\` should be the last thing you type before committing code. If it passes, you have evidence. If it fails, you have a problem to fix.

CTest is the bridge between your tests and CDash — the dashboard that makes test results visible to your entire team.`,
  },

  {
    moduleNumber: 13,
    track: "advanced",
    title: "CDash: The Testing Dashboard",
    subtitle: "Submitting results and monitoring project health",
    estimatedMinutes: 15,
    sparkContent: `## Dear Marilyn,

We run tests in CI, but only the person who broke the build knows about it. How can we make test results visible to the whole team, with history and trends?

— Dashboarding in Dublin

---

## Marilyn Responds:

You are describing **CDash** — the web-based testing dashboard that is the third pillar of the CMake ecosystem (alongside CTest and CPack).

CDash receives test results submitted by CTest and displays them in a web interface showing:
- Which tests passed and failed
- Build warnings and errors
- Test coverage
- Memory errors (Valgrind, AddressSanitizer)
- Historical trends

---

## Setting Up CDash Submission

In your \`CMakeLists.txt\`:
\`\`\`cmake
include(CTest)

set(CTEST_PROJECT_NAME "MyProject")
set(CTEST_NIGHTLY_START_TIME "01:00:00 UTC")
set(CTEST_DROP_METHOD "https")
set(CTEST_DROP_SITE "my.cdash.org")
set(CTEST_DROP_LOCATION "/submit.php?project=MyProject")
\`\`\`

Or in a \`CTestConfig.cmake\` file (preferred):
\`\`\`cmake
set(CTEST_PROJECT_NAME "MyProject")
set(CTEST_DROP_METHOD "https")
set(CTEST_DROP_SITE "my.cdash.org")
set(CTEST_DROP_LOCATION "/submit.php?project=MyProject")
\`\`\`

---

## Submitting Results

\`\`\`bash
# The full CDash workflow:
ctest --test-dir build -D Experimental

# Or step by step:
ctest --test-dir build -D ExperimentalStart
ctest --test-dir build -D ExperimentalConfigure
ctest --test-dir build -D ExperimentalBuild
ctest --test-dir build -D ExperimentalTest
ctest --test-dir build -D ExperimentalSubmit
\`\`\`

---

## Dashboard Tracks

| Track | When to use |
|---|---|
| Experimental | Developer testing — submit anytime |
| Nightly | Automated nightly builds |
| Continuous | Triggered by commits |

---

## CTest Scripts

For complex CI workflows, use a CTest script:
\`\`\`cmake
# ci_build.cmake
set(CTEST_SOURCE_DIRECTORY "/path/to/source")
set(CTEST_BINARY_DIRECTORY "/path/to/build")
set(CTEST_BUILD_NAME "Linux-GCC-Release")
set(CTEST_SITE "ci-server-01")

ctest_start(Continuous)
ctest_configure()
ctest_build()
ctest_test()
ctest_submit()
\`\`\`

\`\`\`bash
ctest -S ci_build.cmake
\`\`\``,

    cruciblePrompt: `**The Crucible: CDash Integration**

Create a \`CTestConfig.cmake\` file for a project called "AwesomeLib" that submits to \`cdash.example.com\`. Then write the complete sequence of ctest commands to perform a full Continuous dashboard submission (start, configure, build, test, submit).`,

    crucibleSample: `**CTestConfig.cmake:**
\`\`\`cmake
set(CTEST_PROJECT_NAME "AwesomeLib")
set(CTEST_NIGHTLY_START_TIME "00:00:00 UTC")
set(CTEST_DROP_METHOD "https")
set(CTEST_DROP_SITE "cdash.example.com")
set(CTEST_DROP_LOCATION "/submit.php?project=AwesomeLib")
set(CTEST_DROP_SITE_CDASH TRUE)
\`\`\`

**CTest commands:**
\`\`\`bash
ctest --test-dir build -D ContinuousStart
ctest --test-dir build -D ContinuousConfigure
ctest --test-dir build -D ContinuousBuild
ctest --test-dir build -D ContinuousTest
ctest --test-dir build -D ContinuousSubmit
\`\`\`

Or the shorthand: \`ctest --test-dir build -D Continuous\``,

    imprintContent: `## The Imprint: Visibility Is Quality

A test that fails silently is worse than no test at all — it creates false confidence.

CDash makes test results **visible**. When the whole team can see the dashboard, broken builds get fixed faster. Trends become apparent. Regressions are caught before they compound.

The CDash workflow is: **Build → Test → Submit → Observe → Fix**. The "Observe" step is what CDash provides. Without it, you are flying blind.`,
  },

  {
    moduleNumber: 14,
    track: "advanced",
    title: "The CMake Tutorial: A Complete Project",
    subtitle: "Building a real project from scratch, step by step",
    estimatedMinutes: 25,
    sparkContent: `## Dear Marilyn,

I've read about CMake concepts but I need to see them all working together in a real project. Can you walk me through building a complete project from scratch?

— Practicing in Philadelphia

---

## Marilyn Responds:

Theory without practice is philosophy. Let us build something real.

We will create \`MathTutor\` — a library that performs mathematical operations, with a command-line application, unit tests, proper installation rules, and packaging. This is a complete, production-ready CMake project.

---

## Project Structure

\`\`\`
MathTutor/
├── CMakeLists.txt          # Top-level
├── CMakePresets.json       # Build presets
├── CTestConfig.cmake       # CDash config
├── cmake/
│   └── MathTutorConfig.cmake.in
├── include/
│   └── mathtutor/
│       └── math.h
├── src/
│   ├── CMakeLists.txt
│   └── math.cpp
├── app/
│   ├── CMakeLists.txt
│   └── main.cpp
└── tests/
    ├── CMakeLists.txt
    └── test_math.cpp
\`\`\`

---

## Top-Level CMakeLists.txt

\`\`\`cmake
cmake_minimum_required(VERSION 3.20)
project(MathTutor VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

option(MATHTUTOR_BUILD_TESTS "Build tests" ON)
option(MATHTUTOR_BUILD_APP "Build the CLI application" ON)

include(GNUInstallDirs)
include(CMakePackageConfigHelpers)

add_subdirectory(src)

if(MATHTUTOR_BUILD_APP)
  add_subdirectory(app)
endif()

if(MATHTUTOR_BUILD_TESTS)
  enable_testing()
  add_subdirectory(tests)
endif()

# Installation and packaging
include(CPack)
\`\`\`

---

## src/CMakeLists.txt

\`\`\`cmake
add_library(mathtutor
  math.cpp
)

target_include_directories(mathtutor
  PUBLIC
    $<BUILD_INTERFACE:\${CMAKE_SOURCE_DIR}/include>
    $<INSTALL_INTERFACE:\${CMAKE_INSTALL_INCLUDEDIR}>
)

install(TARGETS mathtutor
  EXPORT MathTutorTargets
  LIBRARY DESTINATION \${CMAKE_INSTALL_LIBDIR}
  ARCHIVE DESTINATION \${CMAKE_INSTALL_LIBDIR}
)

install(DIRECTORY \${CMAKE_SOURCE_DIR}/include/
  DESTINATION \${CMAKE_INSTALL_INCLUDEDIR}
)
\`\`\`

The **generator expression** \`$<BUILD_INTERFACE:...>\` vs \`$<INSTALL_INTERFACE:...>\` is crucial: it gives different include paths depending on whether the target is being used from the build tree or from an installed location.`,

    cruciblePrompt: `**The Crucible: Generator Expressions**

Generator expressions are evaluated at build time, not at configure time. They are written as \`$<...>\`.

Explain the difference between these two include directory specifications and when you would use each:

\`\`\`cmake
# Option A:
target_include_directories(mylib PUBLIC include/)

# Option B:
target_include_directories(mylib PUBLIC
  $<BUILD_INTERFACE:\${CMAKE_CURRENT_SOURCE_DIR}/include>
  $<INSTALL_INTERFACE:include>
)
\`\`\`

Then write the generator expression that adds the \`-DDEBUG_MODE\` compile definition only in Debug builds.`,

    crucibleSample: `**Option A** uses a relative path. This works for the build tree but is incorrect for installed targets — after installation, the include directory is no longer at a relative path from the library.

**Option B** uses generator expressions to provide the correct path in each context:
- \`$<BUILD_INTERFACE:...>\` — the absolute source path, used when building
- \`$<INSTALL_INTERFACE:...>\` — the relative install path, used after \`cmake --install\`

Option B is the correct approach for any library that will be installed and used by other projects.

**Debug-only compile definition:**
\`\`\`cmake
target_compile_definitions(mylib PRIVATE
  $<$<CONFIG:Debug>:DEBUG_MODE>
)
\`\`\`

The syntax is \`$<$<CONFIG:Debug>:VALUE>\` — a nested generator expression that evaluates to VALUE only when the build configuration is Debug.`,

    imprintContent: `## The Imprint: The Complete Picture

You now have all the pieces. A production CMake project is:

1. **CMakeLists.txt** — the build logic
2. **install()** rules — what gets deployed
3. **enable_testing()** + \`add_test()\` — the test suite
4. **CPack** configuration — the distribution package
5. **CTestConfig.cmake** — the dashboard submission

These five elements, working together, constitute a complete, professional software build system. Everything else is refinement.`,
  },

  {
    moduleNumber: 15,
    track: "advanced",
    title: "User Interaction Guide: Presets and Options",
    subtitle: "Making your build system user-friendly",
    estimatedMinutes: 15,
    sparkContent: `## Dear Marilyn,

My CMake project has dozens of configuration options. New developers don't know which ones to set. I end up writing long README sections just to explain how to configure the build. Is there a better way?

— Documenting in Düsseldorf

---

## Marilyn Responds:

You are describing the problem that **CMake Presets** were designed to solve. Instead of documenting a long list of \`-D\` flags, you define named configurations that capture the intent.

---

## CMakePresets.json

\`\`\`json
{
  "version": 6,
  "configurePresets": [
    {
      "name": "default",
      "displayName": "Default Config",
      "description": "Default build using Ninja",
      "generator": "Ninja",
      "binaryDir": "\${sourceDir}/build/\${presetName}",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug"
      }
    },
    {
      "name": "release",
      "displayName": "Release Build",
      "inherits": "default",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release",
        "BUILD_TESTING": "OFF"
      }
    },
    {
      "name": "ci",
      "displayName": "CI Build",
      "inherits": "release",
      "cacheVariables": {
        "BUILD_TESTING": "ON",
        "CMAKE_EXPORT_COMPILE_COMMANDS": "ON"
      }
    }
  ],
  "buildPresets": [
    {
      "name": "default",
      "configurePreset": "default"
    },
    {
      "name": "release",
      "configurePreset": "release"
    }
  ],
  "testPresets": [
    {
      "name": "default",
      "configurePreset": "ci",
      "output": { "outputOnFailure": true },
      "execution": { "jobs": 4 }
    }
  ]
}
\`\`\`

---

## Using Presets

\`\`\`bash
cmake --list-presets          # Show available presets
cmake --preset default        # Configure with "default" preset
cmake --build --preset default  # Build with "default" preset
ctest --preset default        # Test with "default" preset
\`\`\`

---

## The option() Command

For user-facing options, always use \`option()\`:

\`\`\`cmake
option(BUILD_SHARED_LIBS "Build shared libraries" OFF)
option(BUILD_TESTING "Build the test suite" ON)
option(ENABLE_COVERAGE "Enable code coverage" OFF)
option(ENABLE_SANITIZERS "Enable address sanitizer" OFF)
\`\`\`

These appear in \`cmake-gui\` and \`ccmake\` as checkboxes, making them discoverable.`,

    cruciblePrompt: `**The Crucible: Creating Presets**

Create a \`CMakePresets.json\` for a project with three presets:
1. \`dev\` — Debug build with Ninja, tests enabled, build in \`build/dev/\`
2. \`release\` — Release build with Ninja, tests disabled, build in \`build/release/\`
3. \`asan\` — Debug build with AddressSanitizer enabled (add \`-DENABLE_ASAN=ON\`), inheriting from \`dev\`

Include a test preset for \`dev\` that runs tests with 4 parallel jobs and shows output on failure.`,

    crucibleSample: `\`\`\`json
{
  "version": 6,
  "configurePresets": [
    {
      "name": "dev",
      "displayName": "Development",
      "generator": "Ninja",
      "binaryDir": "\${sourceDir}/build/dev",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug",
        "BUILD_TESTING": "ON"
      }
    },
    {
      "name": "release",
      "displayName": "Release",
      "generator": "Ninja",
      "binaryDir": "\${sourceDir}/build/release",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release",
        "BUILD_TESTING": "OFF"
      }
    },
    {
      "name": "asan",
      "displayName": "AddressSanitizer",
      "inherits": "dev",
      "binaryDir": "\${sourceDir}/build/asan",
      "cacheVariables": {
        "ENABLE_ASAN": "ON"
      }
    }
  ],
  "testPresets": [
    {
      "name": "dev",
      "configurePreset": "dev",
      "output": { "outputOnFailure": true },
      "execution": { "jobs": 4 }
    }
  ]
}
\`\`\``,

    imprintContent: `## The Imprint: Presets Are Documentation

A \`CMakePresets.json\` file is not just a convenience — it is executable documentation. Instead of writing "run cmake with these 12 flags," you write a preset named "ci" and anyone can reproduce the exact configuration with \`cmake --preset ci\`.

Commit \`CMakePresets.json\` to version control. It belongs with your code, not in a README that gets out of date.`,
  },

  // Track: Tools (16-20)
  {
    moduleNumber: 16,
    track: "tools",
    title: "Using Dependencies: FetchContent and ExternalProject",
    subtitle: "Managing third-party libraries within your build",
    estimatedMinutes: 20,
    sparkContent: `## Dear Marilyn,

I want to include a third-party library (like GoogleTest or nlohmann/json) in my project without requiring users to install it separately. How do I bundle dependencies with CMake?

— Bundling in Budapest

---

## Marilyn Responds:

CMake provides two mechanisms for incorporating external dependencies: **FetchContent** (for dependencies that become part of your build) and **ExternalProject** (for dependencies that are built separately).

---

## FetchContent: The Modern Approach

FetchContent downloads and integrates dependencies at configure time, making them available as regular CMake targets:

\`\`\`cmake
include(FetchContent)

FetchContent_Declare(
  googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG        v1.14.0
)

FetchContent_Declare(
  nlohmann_json
  GIT_REPOSITORY https://github.com/nlohmann/json.git
  GIT_TAG        v3.11.3
)

# Download and make available
FetchContent_MakeAvailable(googletest nlohmann_json)

# Now use them as regular targets
target_link_libraries(mytest PRIVATE GTest::gtest_main)
target_link_libraries(myapp PRIVATE nlohmann_json::nlohmann_json)
\`\`\`

---

## FetchContent vs. find_package()

The recommended pattern is to try \`find_package()\` first, then fall back to FetchContent:

\`\`\`cmake
find_package(nlohmann_json 3.11 QUIET)
if(NOT nlohmann_json_FOUND)
  include(FetchContent)
  FetchContent_Declare(
    nlohmann_json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.3
  )
  FetchContent_MakeAvailable(nlohmann_json)
endif()
\`\`\`

---

## ExternalProject: For Complex Dependencies

ExternalProject builds dependencies at build time (not configure time), in a separate build tree:

\`\`\`cmake
include(ExternalProject)

ExternalProject_Add(
  zlib_external
  GIT_REPOSITORY https://github.com/madler/zlib.git
  GIT_TAG v1.3.1
  CMAKE_ARGS
    -DCMAKE_INSTALL_PREFIX=\${CMAKE_BINARY_DIR}/deps
    -DCMAKE_BUILD_TYPE=Release
)
\`\`\`

Use ExternalProject when the dependency has a complex build system or when you need to isolate it completely from your main build.`,

    cruciblePrompt: `**The Crucible: FetchContent Integration**

Write the CMake code to:
1. Use FetchContent to download \`fmt\` library from \`https://github.com/fmtlib/fmt.git\` at tag \`10.2.1\`
2. Prevent fmt from installing alongside your project (hint: set \`FMT_INSTALL\` to OFF before \`FetchContent_MakeAvailable\`)
3. Link a target \`myapp\` against fmt`,

    crucibleSample: `\`\`\`cmake
include(FetchContent)

FetchContent_Declare(
  fmt
  GIT_REPOSITORY https://github.com/fmtlib/fmt.git
  GIT_TAG        10.2.1
)

# Prevent fmt from adding its install rules to our project
set(FMT_INSTALL OFF CACHE BOOL "" FORCE)

FetchContent_MakeAvailable(fmt)

add_executable(myapp main.cpp)
target_link_libraries(myapp PRIVATE fmt::fmt)
\`\`\``,

    imprintContent: `## The Imprint: Reproducible Builds

The purpose of FetchContent is **reproducibility**. When you pin a dependency to a specific \`GIT_TAG\`, anyone who builds your project gets exactly the same version of that dependency — regardless of what is installed on their system.

This is the difference between "it works on my machine" and "it works everywhere."

Always pin to a specific tag or commit hash. Never use \`GIT_TAG main\` or \`GIT_TAG master\` — those are moving targets.`,
  },

  {
    moduleNumber: 17,
    track: "tools",
    title: "Importing and Exporting: Config Packages",
    subtitle: "Making your library consumable by other CMake projects",
    estimatedMinutes: 20,
    sparkContent: `## Dear Marilyn,

I've built a library and installed it. Now I want other CMake projects to be able to use \`find_package(MyLib)\` to find and use it. How do I create a proper CMake package?

— Exporting in Edinburgh

---

## Marilyn Responds:

You are asking how to make your library a **first-class CMake citizen** — a package that other projects can discover and use with \`find_package()\`. This requires creating a **CMake Config Package**.

---

## The Three Files You Need

A CMake Config Package consists of:

1. **\`MyLibConfig.cmake\`** — the main config file (found by \`find_package()\`)
2. **\`MyLibConfigVersion.cmake\`** — version compatibility information
3. **\`MyLibTargets.cmake\`** — the exported targets

---

## Exporting Targets

\`\`\`cmake
# In src/CMakeLists.txt:
install(TARGETS mylib
  EXPORT MyLibTargets
  LIBRARY DESTINATION \${CMAKE_INSTALL_LIBDIR}
  ARCHIVE DESTINATION \${CMAKE_INSTALL_LIBDIR}
)

# Install the targets file
install(EXPORT MyLibTargets
  FILE MyLibTargets.cmake
  NAMESPACE MyLib::
  DESTINATION \${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
)
\`\`\`

---

## Generating Config Files

\`\`\`cmake
include(CMakePackageConfigHelpers)

# Generate the config file
configure_package_config_file(
  \${CMAKE_CURRENT_SOURCE_DIR}/cmake/MyLibConfig.cmake.in
  \${CMAKE_CURRENT_BINARY_DIR}/MyLibConfig.cmake
  INSTALL_DESTINATION \${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
)

# Generate the version file
write_basic_package_version_file(
  \${CMAKE_CURRENT_BINARY_DIR}/MyLibConfigVersion.cmake
  VERSION \${PROJECT_VERSION}
  COMPATIBILITY AnyNewerVersion
)

# Install both files
install(FILES
  \${CMAKE_CURRENT_BINARY_DIR}/MyLibConfig.cmake
  \${CMAKE_CURRENT_BINARY_DIR}/MyLibConfigVersion.cmake
  DESTINATION \${CMAKE_INSTALL_LIBDIR}/cmake/MyLib
)
\`\`\`

---

## The Config Template

\`\`\`cmake
# cmake/MyLibConfig.cmake.in
@PACKAGE_INIT@

include("\${CMAKE_CURRENT_LIST_DIR}/MyLibTargets.cmake")

check_required_components(MyLib)
\`\`\`

---

## Consuming the Package

\`\`\`cmake
find_package(MyLib 1.0 REQUIRED)
target_link_libraries(myapp PRIVATE MyLib::mylib)
\`\`\``,

    cruciblePrompt: `**The Crucible: Complete Package Export**

Explain the purpose of the \`NAMESPACE\` argument in \`install(EXPORT ...)\` and why it is important. Then describe what happens when a consumer calls \`find_package(MyLib REQUIRED)\` — trace the file lookup sequence that CMake performs.`,

    crucibleSample: `**The NAMESPACE argument** prefixes all exported target names. When you use \`NAMESPACE MyLib::\`, the target \`mylib\` becomes \`MyLib::mylib\` in the exported package.

This is important for two reasons:
1. **Clarity:** Consumers know the target belongs to MyLib
2. **Collision avoidance:** Prevents name clashes with targets from other packages

**The find_package() lookup sequence:**

1. CMake searches for \`MyLibConfig.cmake\` or \`mylib-config.cmake\` in:
   - Directories in \`CMAKE_PREFIX_PATH\`
   - The standard system prefix paths (\`/usr/lib/cmake/MyLib/\`, etc.)
   - The \`MyLib_DIR\` cache variable if set

2. If found, CMake reads \`MyLibConfig.cmake\`, which:
   - Runs \`@PACKAGE_INIT@\` to set up path variables
   - Includes \`MyLibTargets.cmake\`, which defines the \`MyLib::mylib\` imported target
   - Runs \`check_required_components()\` to verify all requested components are available

3. The imported target \`MyLib::mylib\` is now available with all its include paths and link flags embedded.`,

    imprintContent: `## The Imprint: The Package Is a Contract

When you create a CMake Config Package, you are making a contract with your users:

"Use \`find_package(MyLib)\` and you will get a target named \`MyLib::mylib\` that knows everything it needs — include paths, link flags, transitive dependencies."

This contract is the foundation of the modern CMake ecosystem. Every major library that supports CMake honors this contract. When you honor it too, your library becomes a first-class citizen.`,
  },

  {
    moduleNumber: 18,
    track: "tools",
    title: "IDE Integration Guide",
    subtitle: "Visual Studio, VS Code, CLion, and Xcode",
    estimatedMinutes: 15,
    sparkContent: `## Dear Marilyn,

My team uses a mix of IDEs — some use VS Code, some use CLion, some use Visual Studio. How do I make my CMake project work well with all of them?

— Integrating in Indianapolis

---

## Marilyn Responds:

The beauty of CMake is that a well-written \`CMakeLists.txt\` is the universal language that all modern IDEs understand. You do not need to maintain separate project files for each IDE — CMake is the project file.

---

## VS Code with CMake Tools

Install the **CMake Tools** extension. It reads your \`CMakeLists.txt\` and \`CMakePresets.json\` automatically.

Key settings in \`.vscode/settings.json\`:
\`\`\`json
{
  "cmake.configureOnOpen": true,
  "cmake.buildDirectory": "\${workspaceFolder}/build/\${buildType}",
  "cmake.generator": "Ninja"
}
\`\`\`

The extension provides:
- IntelliSense based on compile commands
- One-click configure, build, test, and debug
- Preset selection from the status bar

---

## Compile Commands for IntelliSense

Generate \`compile_commands.json\` for any IDE or tool that needs it:

\`\`\`bash
cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=ON -S . -B build
\`\`\`

Or in \`CMakeLists.txt\`:
\`\`\`cmake
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
\`\`\`

This file tells clangd, clang-tidy, and other tools exactly how each source file is compiled.

---

## CLion

CLion has native CMake support — just open the folder containing \`CMakeLists.txt\`. CLion reads presets, manages multiple build configurations, and integrates CTest directly.

---

## Visual Studio

Visual Studio 2017+ has native CMake support. Open the folder and Visual Studio detects \`CMakeLists.txt\` automatically. It uses \`CMakePresets.json\` for configuration.

---

## Xcode

\`\`\`bash
cmake -G Xcode -S . -B build-xcode
open build-xcode/MyProject.xcodeproj
\`\`\`

---

## .gitignore for IDEs

\`\`\`gitignore
# CMake build directories
build/
build-*/
cmake-build-*/

# IDE files
.vscode/
.idea/
*.xcodeproj/
*.xcworkspace/
\`\`\``,

    cruciblePrompt: `**The Crucible: IDE Setup**

A new developer joins your team. They use VS Code with the CMake Tools extension. Your project uses \`CMakePresets.json\` with a preset named \`dev\`.

Write:
1. The \`.vscode/settings.json\` configuration that tells CMake Tools to use the \`dev\` preset by default
2. The \`CMakePresets.json\` entry that enables compile commands export for the \`dev\` preset
3. The command to generate \`compile_commands.json\` from the command line`,

    crucibleSample: `**.vscode/settings.json:**
\`\`\`json
{
  "cmake.configureOnOpen": true,
  "cmake.defaultVariants": {},
  "cmake.preferredGenerators": ["Ninja"],
  "cmake.useCMakePresets": "always"
}
\`\`\`

**CMakePresets.json dev preset update:**
\`\`\`json
{
  "name": "dev",
  "displayName": "Development",
  "generator": "Ninja",
  "binaryDir": "\${sourceDir}/build/dev",
  "cacheVariables": {
    "CMAKE_BUILD_TYPE": "Debug",
    "BUILD_TESTING": "ON",
    "CMAKE_EXPORT_COMPILE_COMMANDS": "ON"
  }
}
\`\`\`

**Command-line generation:**
\`\`\`bash
cmake --preset dev
# compile_commands.json is now at build/dev/compile_commands.json
# Symlink it to the root for tools that expect it there:
ln -sf build/dev/compile_commands.json compile_commands.json
\`\`\``,

    imprintContent: `## The Imprint: CMake Is the Project File

The old world: one project file per IDE. The new world: one \`CMakeLists.txt\` for all IDEs.

When you write good CMake, you are not just writing a build system. You are writing a universal project description that every modern IDE, every CI system, and every developer on every platform can understand.

The \`compile_commands.json\` file is the bridge between CMake and the tools that need to understand your code: clangd for IntelliSense, clang-tidy for linting, include-what-you-use for dependency analysis.`,
  },

  {
    moduleNumber: 19,
    track: "tools",
    title: "Advanced Techniques: Generator Expressions and More",
    subtitle: "Power user features for complex build scenarios",
    estimatedMinutes: 20,
    sparkContent: `## Dear Marilyn,

I keep seeing cryptic expressions like \`$<TARGET_FILE:mylib>\` and \`$<BOOL:\${SOME_VAR}>\` in CMake files. What are generator expressions and when should I use them?

— Generating in Gothenburg

---

## Marilyn Responds:

Generator expressions are CMake's way of expressing values that are not known at configure time but are known at build time. They are evaluated lazily — only when the build system generator processes them.

---

## Why Generator Expressions Exist

Consider this problem: you want to add a compile definition only in Debug builds. At configure time, CMake doesn't know which build type will be used (especially with multi-config generators like Visual Studio). Generator expressions solve this:

\`\`\`cmake
# Wrong: evaluated at configure time
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
  target_compile_definitions(mylib PRIVATE DEBUG_CHECKS)
endif()

# Right: evaluated at build time
target_compile_definitions(mylib PRIVATE
  $<$<CONFIG:Debug>:DEBUG_CHECKS>
)
\`\`\`

---

## Common Generator Expressions

\`\`\`cmake
# Conditional
$<BOOL:variable>              # 1 if variable is true, 0 otherwise
$<IF:condition,true,false>    # Ternary
$<$<CONFIG:Debug>:value>      # value only in Debug config

# Target information
$<TARGET_FILE:target>         # Full path to target's output file
$<TARGET_FILE_DIR:target>     # Directory of target's output file
$<TARGET_FILE_NAME:target>    # Filename only

# Build interface vs install interface
$<BUILD_INTERFACE:path>       # Path for build tree
$<INSTALL_INTERFACE:path>     # Path for install tree

# Compiler/platform
$<CXX_COMPILER_ID:GNU>        # 1 if compiler is GCC
$<PLATFORM_ID:Linux>          # 1 if platform is Linux
\`\`\`

---

## Practical Examples

\`\`\`cmake
# Copy DLL next to executable on Windows
add_custom_command(TARGET myapp POST_BUILD
  COMMAND \${CMAKE_COMMAND} -E copy_if_different
    $<TARGET_FILE:mylib>
    $<TARGET_FILE_DIR:myapp>
)

# Enable LTO only in Release
target_compile_options(mylib PRIVATE
  $<$<AND:$<CONFIG:Release>,$<CXX_COMPILER_ID:GNU>>:-flto>
)

# Different flags per compiler
target_compile_options(mylib PRIVATE
  $<$<CXX_COMPILER_ID:MSVC>:/W4>
  $<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-Wall;-Wextra>
)
\`\`\``,

    cruciblePrompt: `**The Crucible: Generator Expressions**

Write the CMake code for a target \`myapp\` that:
1. Enables Link Time Optimization (LTO) only in Release builds (use \`-flto\` for GCC/Clang, \`/GL\` for MSVC)
2. After building, copies the output file to a directory \`dist/\` relative to the source root
3. Adds a compile definition \`APP_VERSION="\${PROJECT_VERSION}"\` using a generator expression`,

    crucibleSample: `\`\`\`cmake
# LTO in Release builds
target_compile_options(myapp PRIVATE
  $<$<AND:$<CONFIG:Release>,$<NOT:$<CXX_COMPILER_ID:MSVC>>>:-flto>
  $<$<AND:$<CONFIG:Release>,$<CXX_COMPILER_ID:MSVC>>:/GL>
)
target_link_options(myapp PRIVATE
  $<$<AND:$<CONFIG:Release>,$<NOT:$<CXX_COMPILER_ID:MSVC>>>:-flto>
  $<$<AND:$<CONFIG:Release>,$<CXX_COMPILER_ID:MSVC>>:/LTCG>
)

# Copy output to dist/ after build
add_custom_command(TARGET myapp POST_BUILD
  COMMAND \${CMAKE_COMMAND} -E make_directory
    \${CMAKE_SOURCE_DIR}/dist
  COMMAND \${CMAKE_COMMAND} -E copy_if_different
    $<TARGET_FILE:myapp>
    \${CMAKE_SOURCE_DIR}/dist/$<TARGET_FILE_NAME:myapp>
  COMMENT "Copying myapp to dist/"
)

# Version definition
target_compile_definitions(myapp PRIVATE
  APP_VERSION="\${PROJECT_VERSION}"
)
\`\`\``,

    imprintContent: `## The Imprint: Build Time vs. Configure Time

The fundamental distinction in CMake is between **configure time** (when CMake runs) and **build time** (when the compiler runs).

Most CMake code runs at configure time. Generator expressions run at build time. This distinction matters for:
- Multi-config generators (Visual Studio, Xcode) where the build type isn't known at configure time
- Target file paths that aren't known until the target is built
- Anything that depends on which configuration is being built

When you find yourself writing \`if(CMAKE_BUILD_TYPE STREQUAL "Debug")\`, ask yourself: "Should this be a generator expression instead?"`,
  },

  {
    moduleNumber: 20,
    track: "tools",
    title: "CMake Mastery Final Exam",
    subtitle: "The comprehensive assessment — prove your mastery",
    estimatedMinutes: 30,
    sparkContent: `## Dear Marilyn,

I've completed all the modules. I feel like I understand CMake, but I want to know if I truly have mastered it. What separates a CMake novice from a CMake master?

— Graduating in Glasgow

---

## Marilyn Responds:

The difference between a novice and a master is not the number of commands they know. It is the *questions* they ask.

A novice asks: "How do I do X in CMake?"
A master asks: "What is the *intent* of this build, and how do I express it most clearly?"

CMake mastery is the ability to look at a build problem and immediately see the target graph, the dependency relationships, the visibility requirements, and the installation structure. The commands are just vocabulary. The graph is the language.

---

## The Master's Checklist

A CMake master always:

✓ **Uses target-based commands** — never \`include_directories()\` or \`link_libraries()\`

✓ **Sets visibility correctly** — PRIVATE by default, PUBLIC only when necessary

✓ **Builds out-of-source** — always \`-S . -B build\`

✓ **Uses GNUInstallDirs** — never hardcodes \`lib\` or \`bin\`

✓ **Exports targets properly** — with namespaces and config files

✓ **Writes tests** — and runs them with CTest

✓ **Creates presets** — so the team has a shared configuration

✓ **Uses generator expressions** — for build-time decisions

✓ **Pins dependencies** — specific tags, not branches

✓ **Packages with CPack** — so the build produces a distributable artifact

---

## What You Have Learned

In this course, you have mastered:

| Module | Topic |
|---|---|
| 1-2 | Why CMake, installation, and the three-step dance |
| 3-5 | Targets, cache, policies, properties, and scope |
| 6-7 | Modules and installation rules |
| 8-9 | Finding packages and custom commands |
| 10 | Cross-compiling and migration |
| 11-13 | CPack, CTest, and CDash |
| 14-15 | Complete projects and presets |
| 16-17 | FetchContent and package export |
| 18-19 | IDE integration and generator expressions |
| 20 | Mastery |

You are now equipped to build, test, package, and distribute professional C and C++ software using the complete CMake ecosystem. Go build something remarkable.`,

    cruciblePrompt: `**The Final Crucible: Design a Complete Project**

You are starting a new open-source C++ library called \`StringUtils\` that:
- Provides string manipulation utilities
- Supports C++17
- Has public headers in \`include/stringutils/\`
- Has unit tests using GoogleTest (fetched via FetchContent)
- Should be installable with a proper CMake Config Package
- Should be packageable with CPack (DEB and ZIP)
- Should have a \`dev\` preset for development and a \`release\` preset for packaging

Design the complete project structure (directory tree) and write the top-level \`CMakeLists.txt\`. You do not need to write the subdirectory CMakeLists files, but describe what each would contain.`,

    crucibleSample: `**Project Structure:**
\`\`\`
StringUtils/
├── CMakeLists.txt
├── CMakePresets.json
├── CTestConfig.cmake
├── cmake/
│   └── StringUtilsConfig.cmake.in
├── include/
│   └── stringutils/
│       └── stringutils.h
├── src/
│   ├── CMakeLists.txt      # add_library, install(TARGETS EXPORT)
│   └── stringutils.cpp
└── tests/
    ├── CMakeLists.txt      # FetchContent(googletest), gtest_discover_tests
    └── test_stringutils.cpp
\`\`\`

**Top-level CMakeLists.txt:**
\`\`\`cmake
cmake_minimum_required(VERSION 3.20)
project(StringUtils VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

option(STRINGUTILS_BUILD_TESTS "Build tests" ON)

include(GNUInstallDirs)
include(CMakePackageConfigHelpers)

add_subdirectory(src)

if(STRINGUTILS_BUILD_TESTS)
  enable_testing()
  add_subdirectory(tests)
endif()

# Package config
configure_package_config_file(
  cmake/StringUtilsConfig.cmake.in
  \${CMAKE_CURRENT_BINARY_DIR}/StringUtilsConfig.cmake
  INSTALL_DESTINATION \${CMAKE_INSTALL_LIBDIR}/cmake/StringUtils
)
write_basic_package_version_file(
  \${CMAKE_CURRENT_BINARY_DIR}/StringUtilsConfigVersion.cmake
  VERSION \${PROJECT_VERSION}
  COMPATIBILITY AnyNewerVersion
)
install(FILES
  \${CMAKE_CURRENT_BINARY_DIR}/StringUtilsConfig.cmake
  \${CMAKE_CURRENT_BINARY_DIR}/StringUtilsConfigVersion.cmake
  DESTINATION \${CMAKE_INSTALL_LIBDIR}/cmake/StringUtils
)

# CPack
set(CPACK_PACKAGE_NAME "StringUtils")
set(CPACK_PACKAGE_VERSION \${PROJECT_VERSION})
set(CPACK_PACKAGE_VENDOR "My Organization")
include(CPack)
\`\`\``,

    imprintContent: `## The Imprint: You Are Now a CMake Master

You have completed the journey from "Why CMake?" to a complete mastery of the CMake ecosystem.

The tools you now command:
- **cmake** — the architect
- **ctest** — the quality guardian
- **cpack** — the distributor
- **cdash** — the observatory

These four tools, working together, constitute a complete software delivery pipeline. From source code to tested, packaged, distributable artifact — CMake handles it all.

**The final truth:** CMake is not about memorizing commands. It is about understanding the build as a graph of intentions. Targets are nodes. Dependencies are edges. Visibility is the direction of flow.

Draw the graph. Write the CMake. Ship the software.

*Congratulations, CMake Master. Your diploma awaits.*`,
  },
];

// ============ QUIZ QUESTIONS ============
const QUIZ_QUESTIONS = [
  // Module 1 - Why CMake?
  { moduleId: 1, questionNumber: 1, question: "What is the fundamental difference between CMake and a build system like Make?", options: ["CMake is faster than Make", "CMake is a build system generator, not a build system itself", "CMake only works on Linux", "CMake requires a C++ compiler"], correctAnswer: 1, explanation: "CMake generates native build files (Makefiles, Ninja files, Visual Studio solutions) for the target platform. It does not compile code directly." },
  { moduleId: 1, questionNumber: 2, question: "What are the two distinct phases of a CMake build?", options: ["Compile and Link", "Configure and Build", "Download and Install", "Parse and Execute"], correctAnswer: 1, explanation: "Phase 1 (Configure): CMake reads CMakeLists.txt and generates native build files. Phase 2 (Build): The native build tool compiles the code." },
  { moduleId: 1, questionNumber: 3, question: "What is the correct command for an out-of-source build?", options: ["cmake .", "cmake --build .", "cmake -S . -B build", "cmake -o build ."], correctAnswer: 2, explanation: "-S specifies the source directory and -B specifies the binary/build directory. This keeps the source tree clean." },
  { moduleId: 1, questionNumber: 4, question: "Which of the following is NOT a benefit of using CMake?", options: ["Cross-platform support", "Automatic dependency detection", "Replaces the need for a C++ compiler", "IDE integration"], correctAnswer: 2, explanation: "CMake is a build system generator. It still requires a C++ compiler (GCC, Clang, MSVC) to actually compile the code." },
  { moduleId: 1, questionNumber: 5, question: "What is the minimum required content of a CMakeLists.txt file to build a single executable?", options: ["Just the add_executable() command", "cmake_minimum_required(), project(), and add_executable()", "Only the project() command", "cmake_minimum_required() and add_executable()"], correctAnswer: 1, explanation: "A valid CMakeLists.txt requires cmake_minimum_required() for version compatibility, project() to name the project, and add_executable() to define what to build." },

  // Module 2 - Getting Started
  { moduleId: 2, questionNumber: 1, question: "Which CMake tool provides a graphical interface for configuring build options?", options: ["ccmake", "cmake-gui", "ctest", "cpack"], correctAnswer: 1, explanation: "cmake-gui is the graphical configuration tool. ccmake provides a terminal-based (curses) interface." },
  { moduleId: 2, questionNumber: 2, question: "What does the -G flag specify when running cmake?", options: ["The generator (build system) to use", "The Git repository to clone", "The global configuration file", "The graphics library to link"], correctAnswer: 0, explanation: "The -G flag specifies the generator, e.g., -G Ninja or -G 'Unix Makefiles'. This determines what kind of build files CMake generates." },
  { moduleId: 2, questionNumber: 3, question: "What are the four standard CMake build types?", options: ["Fast, Slow, Safe, Unsafe", "Debug, Release, RelWithDebInfo, MinSizeRel", "Dev, Staging, Production, Test", "Compile, Link, Archive, Install"], correctAnswer: 1, explanation: "Debug (no optimization, debug symbols), Release (optimized), RelWithDebInfo (optimized with debug symbols), MinSizeRel (optimized for size)." },
  { moduleId: 2, questionNumber: 4, question: "Which command builds a specific target named 'mylib' from a build directory?", options: ["cmake --build build --target mylib", "cmake build mylib", "make mylib", "cmake -T mylib build"], correctAnswer: 0, explanation: "cmake --build <dir> --target <target> builds a specific target. This is the platform-agnostic way to build." },
  { moduleId: 2, questionNumber: 5, question: "What file contains all the variables CMake detected and cached during configuration?", options: ["CMakeLists.txt", "cmake_install.cmake", "CMakeCache.txt", "CMakeFiles/CMakeOutput.log"], correctAnswer: 2, explanation: "CMakeCache.txt in the build directory stores all cache variables — compiler paths, library locations, user-defined options, etc." },

  // Module 3 - Writing CMakeLists Files
  { moduleId: 3, questionNumber: 1, question: "What is the difference between target_include_directories() with PUBLIC vs PRIVATE?", options: ["PUBLIC is faster, PRIVATE is slower", "PUBLIC propagates to consumers, PRIVATE does not", "PRIVATE is for system headers, PUBLIC is for project headers", "There is no difference"], correctAnswer: 1, explanation: "PUBLIC means both the target itself AND its consumers get the include directory. PRIVATE means only the target itself gets it." },
  { moduleId: 3, questionNumber: 2, question: "Which command creates a header-only library in CMake?", options: ["add_library(mylib HEADER)", "add_library(mylib INTERFACE)", "add_library(mylib STATIC)", "add_library(mylib HEADER_ONLY)"], correctAnswer: 1, explanation: "INTERFACE libraries have no compiled sources. They exist only to propagate properties (include paths, compile definitions) to consumers." },
  { moduleId: 3, questionNumber: 3, question: "What is wrong with using include_directories() in modern CMake?", options: ["It doesn't work on Windows", "It applies to all targets in the directory, not just one target", "It requires absolute paths", "It only works with GCC"], correctAnswer: 1, explanation: "include_directories() is a directory-scoped command — it pollutes all targets in the current directory and subdirectories. Use target_include_directories() instead." },
  { moduleId: 3, questionNumber: 4, question: "When should you use the INTERFACE visibility keyword?", options: ["For private implementation details", "For header-only libraries that propagate settings to consumers but don't compile themselves", "For all public APIs", "When linking to system libraries"], correctAnswer: 1, explanation: "INTERFACE means the setting does NOT apply to the target itself, but DOES propagate to consumers. Perfect for header-only libraries." },
  { moduleId: 3, questionNumber: 5, question: "Which command is the modern replacement for the deprecated link_libraries()?", options: ["add_link_libraries()", "target_link_libraries()", "set_link_libraries()", "cmake_link_libraries()"], correctAnswer: 1, explanation: "target_link_libraries() is the modern, target-scoped replacement. It accepts visibility keywords (PUBLIC, PRIVATE, INTERFACE) for precise dependency management." },

  // Module 4 - CMake Cache
  { moduleId: 4, questionNumber: 1, question: "What is the idiomatic CMake command for declaring a boolean user option?", options: ["set(MY_OPT ON CACHE BOOL 'help')", "option(MY_OPT 'help' ON)", "cache(MY_OPT BOOL ON)", "define_option(MY_OPT ON)"], correctAnswer: 1, explanation: "option() is the idiomatic shorthand for a BOOL cache variable. It's equivalent to set(VAR OFF CACHE BOOL 'help') but more readable." },
  { moduleId: 4, questionNumber: 2, question: "How do you set a cache variable from the command line?", options: ["cmake --set VAR=value", "cmake -DVAR=value", "cmake --cache VAR value", "cmake -C VAR=value"], correctAnswer: 1, explanation: "The -D flag sets cache variables: cmake -DCMAKE_BUILD_TYPE=Release -S . -B build" },
  { moduleId: 4, questionNumber: 3, question: "What happens when you call set(MY_VAR 'new') in CMakeLists.txt if MY_VAR is already in the cache?", options: ["The cache value is overwritten", "The CMakeLists.txt value is used during this run, but the cache is not changed", "CMake throws an error", "The variable is deleted"], correctAnswer: 1, explanation: "A normal set() creates a local variable that shadows the cache variable during this run, but does NOT modify the cache. Use CACHE FORCE to overwrite the cache." },
  { moduleId: 4, questionNumber: 4, question: "Which command lists all non-advanced cache variables?", options: ["cmake --list-cache build", "cmake -L build", "cmake --show-cache build", "cmake -C build"], correctAnswer: 1, explanation: "cmake -L <build_dir> lists cache variables. Add A for advanced variables (-LA) and H for help strings (-LH)." },
  { moduleId: 4, questionNumber: 5, question: "How do you completely reset the CMake cache?", options: ["cmake --reset-cache build", "Delete the build directory and reconfigure", "Run cmake -DCMAKE_RESET=ON", "Edit CMakeCache.txt and remove all entries"], correctAnswer: 1, explanation: "The simplest and safest way to reset the cache is to delete the build directory entirely and re-run cmake. This ensures a completely clean state." },

  // Module 5 - Key Concepts
  { moduleId: 5, questionNumber: 1, question: "What is the purpose of cmake_minimum_required(VERSION 3.20)?", options: ["It downloads CMake 3.20 if not installed", "It sets all policies introduced before 3.20 to NEW behavior", "It prevents the project from building on older CMake versions only", "It enables C++20 features"], correctAnswer: 1, explanation: "cmake_minimum_required() sets the minimum version AND automatically sets all policies introduced before that version to NEW. This is why you should set it as high as possible." },
  { moduleId: 5, questionNumber: 2, question: "How do you make a variable set inside a function visible in the calling scope?", options: ["Use the GLOBAL keyword", "Use the PARENT_SCOPE keyword", "Use the EXPORT keyword", "Variables always propagate upward"], correctAnswer: 1, explanation: "set(VAR value PARENT_SCOPE) sets the variable in the parent (calling) scope. Without PARENT_SCOPE, the variable is local to the function." },
  { moduleId: 5, questionNumber: 3, question: "Which command sets the C++ standard to C++17 for a specific target?", options: ["set(CMAKE_CXX_STANDARD 17)", "target_compile_features(mylib PRIVATE cxx_std_17)", "set_target_properties(mylib PROPERTIES CXX_STANDARD 17)", "Both B and C are correct"], correctAnswer: 3, explanation: "Both target_compile_features(mylib PRIVATE cxx_std_17) and set_target_properties(mylib PROPERTIES CXX_STANDARD 17) work. The properties approach also lets you set CXX_STANDARD_REQUIRED ON." },
  { moduleId: 5, questionNumber: 4, question: "What is a CMake policy?", options: ["A security policy for build artifacts", "A versioned behavior switch that maintains backward compatibility", "A rule for naming targets", "A configuration for CI/CD pipelines"], correctAnswer: 1, explanation: "Policies (CMP0XXX) are versioned behavior switches. They allow CMake to change behavior while maintaining backward compatibility for older projects." },
  { moduleId: 5, questionNumber: 5, question: "What is the scope hierarchy in CMake, from most local to most global?", options: ["Cache → Directory → Function → Environment", "Function → Directory → Cache → Environment", "Environment → Cache → Directory → Function", "Directory → Function → Cache → Environment"], correctAnswer: 1, explanation: "Function scope is most local, then Directory scope, then Cache (persists between runs), then Environment variables (set outside CMake)." },

  // Module 6 - Modules
  { moduleId: 6, questionNumber: 1, question: "How do you add a custom directory to CMake's module search path?", options: ["set(CMAKE_MODULE_DIR 'cmake/')", "list(APPEND CMAKE_MODULE_PATH '${CMAKE_CURRENT_SOURCE_DIR}/cmake')", "include_directories('cmake/')", "add_module_path('cmake/')"], correctAnswer: 1, explanation: "CMAKE_MODULE_PATH is a list of directories where CMake looks for modules. Use list(APPEND ...) to add to it without replacing existing entries." },
  { moduleId: 6, questionNumber: 2, question: "What does include(GNUInstallDirs) provide?", options: ["GNU compiler flags", "Standard installation directory variables like CMAKE_INSTALL_BINDIR", "GNU Make compatibility", "Linux-specific build rules"], correctAnswer: 1, explanation: "GNUInstallDirs provides platform-correct installation directory variables: CMAKE_INSTALL_BINDIR, CMAKE_INSTALL_LIBDIR, CMAKE_INSTALL_INCLUDEDIR, etc." },
  { moduleId: 6, questionNumber: 3, question: "What is the difference between a Find Module and a Config Package?", options: ["Find Modules are faster", "Find Modules are written by CMake/the community for legacy packages; Config Packages are provided by the package itself", "Config Packages only work on Linux", "There is no difference"], correctAnswer: 1, explanation: "Find Modules (FindXxx.cmake) are written externally to locate packages that don't have native CMake support. Config Packages (XxxConfig.cmake) are provided by the package itself." },
  { moduleId: 6, questionNumber: 4, question: "Which module provides the check_cxx_compiler_flag() function?", options: ["CheckCXXFeatures", "CheckCXXCompilerFlag", "TestCXXFlag", "CMakeCXXCheck"], correctAnswer: 1, explanation: "include(CheckCXXCompilerFlag) provides check_cxx_compiler_flag(flag variable) which tests if the compiler supports a given flag." },
  { moduleId: 6, questionNumber: 5, question: "How do you override a built-in CMake Find Module with your own version?", options: ["You cannot override built-in modules", "Place your module in a directory listed in CMAKE_MODULE_PATH before CMake's built-in directory", "Use cmake_policy(SET CMP0017 OLD)", "Rename your module with a different prefix"], correctAnswer: 1, explanation: "CMake searches CMAKE_MODULE_PATH directories first, then its built-in module directory. By placing your module in a CMAKE_MODULE_PATH directory, it takes precedence." },

  // Module 7 - Installing Files
  { moduleId: 7, questionNumber: 1, question: "What is the correct install() command to install a shared library?", options: ["install(TARGETS mylib SHARED DESTINATION lib)", "install(TARGETS mylib LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR})", "install(FILES mylib.so DESTINATION lib)", "install(LIBRARY mylib DESTINATION lib)"], correctAnswer: 1, explanation: "LIBRARY in install(TARGETS) handles shared libraries (.so, .dylib). ARCHIVE handles static libraries. RUNTIME handles executables and DLLs." },
  { moduleId: 7, questionNumber: 2, question: "What does CMAKE_INSTALL_PREFIX control?", options: ["The compiler installation path", "The root directory for all installed files", "The path to CMake itself", "The prefix for all target names"], correctAnswer: 1, explanation: "CMAKE_INSTALL_PREFIX is the root of the installation tree. All DESTINATION paths in install() are relative to this prefix." },
  { moduleId: 7, questionNumber: 3, question: "How do you install to a custom prefix without reconfiguring?", options: ["cmake -DCMAKE_INSTALL_PREFIX=/opt/myapp -S . -B build", "cmake --install build --prefix /opt/myapp", "make DESTDIR=/opt/myapp install", "cmake --prefix /opt/myapp --install build"], correctAnswer: 1, explanation: "cmake --install <build_dir> --prefix <path> installs to a custom prefix without requiring reconfiguration." },
  { moduleId: 7, questionNumber: 4, question: "What is the purpose of the COMPONENT keyword in install()?", options: ["It specifies the C++ component to use", "It groups installed files for selective installation", "It sets the file permissions", "It defines the installation order"], correctAnswer: 1, explanation: "COMPONENT groups files so you can install only certain parts (e.g., just the runtime, or just the development files) with cpack -D CPACK_COMPONENTS_ALL=runtime." },
  { moduleId: 7, questionNumber: 5, question: "Which GNUInstallDirs variable gives the correct library directory on all platforms?", options: ["CMAKE_INSTALL_LIB", "CMAKE_INSTALL_LIBDIR", "CMAKE_LIBRARY_PATH", "LIBRARY_INSTALL_DIR"], correctAnswer: 1, explanation: "CMAKE_INSTALL_LIBDIR is typically 'lib' or 'lib64' depending on the platform. Always use this variable instead of hardcoding 'lib'." },

  // Module 8 - System Inspection and Finding Packages
  { moduleId: 8, questionNumber: 1, question: "What does the REQUIRED keyword do in find_package()?", options: ["Requires the package to be the latest version", "Causes CMake to fail with an error if the package is not found", "Requires root/admin privileges to find the package", "Makes the package a required dependency in the generated package"], correctAnswer: 1, explanation: "REQUIRED causes cmake to stop with a fatal error if the package cannot be found. Without it, you must check PackageName_FOUND manually." },
  { moduleId: 8, questionNumber: 2, question: "What are imported targets in CMake?", options: ["Targets imported from another CMakeLists.txt", "Pre-built library targets that carry all necessary build settings", "Targets imported from Makefiles", "Targets that are only available at install time"], correctAnswer: 1, explanation: "Imported targets (like OpenSSL::SSL) are virtual targets that encapsulate all the settings needed to use a library — include paths, link flags, dependencies." },
  { moduleId: 8, questionNumber: 3, question: "Which find_package() mode searches for XxxConfig.cmake files provided by the package itself?", options: ["MODULE mode", "CONFIG mode", "PACKAGE mode", "SYSTEM mode"], correctAnswer: 1, explanation: "CONFIG mode (also called Package Config mode) searches for XxxConfig.cmake or xxx-config.cmake files installed by the package itself." },
  { moduleId: 8, questionNumber: 4, question: "How do you check if a C++ compiler supports the -std=c++17 flag?", options: ["include(CheckCXXCompilerFlag); check_cxx_compiler_flag('-std=c++17' SUPPORTS_CXX17)", "cmake_check_flag(-std=c++17)", "test_compiler_flag(CXX -std=c++17)", "include(TestCXXFlags); test_cxx_flag(-std=c++17)"], correctAnswer: 0, explanation: "include(CheckCXXCompilerFlag) provides check_cxx_compiler_flag(flag result_variable) which compiles a test program with the flag and stores the result." },
  { moduleId: 8, questionNumber: 5, question: "What is the preferred way to use a found package's include directories?", options: ["include_directories(${OpenSSL_INCLUDE_DIRS})", "target_link_libraries(myapp PRIVATE OpenSSL::SSL)", "target_include_directories(myapp PRIVATE ${OPENSSL_INCLUDE_DIR})", "Both A and C are acceptable"], correctAnswer: 1, explanation: "Using the imported target (OpenSSL::SSL) automatically provides include directories, link libraries, and any other required settings. This is the modern, correct approach." },

  // Module 9 - Custom Commands
  { moduleId: 9, questionNumber: 1, question: "What is the key difference between add_custom_command() and add_custom_target()?", options: ["add_custom_command() is faster", "add_custom_command() produces output files; add_custom_target() is always run", "add_custom_target() can only run scripts", "There is no difference"], correctAnswer: 1, explanation: "add_custom_command(OUTPUT ...) produces files that can be used as inputs to other targets. add_custom_target() creates a named target that always runs when requested." },
  { moduleId: 9, questionNumber: 2, question: "What does the DEPENDS keyword in add_custom_command() do?", options: ["Lists the output files", "Specifies files that must exist before the command runs, triggering re-run if they change", "Declares dependencies on other CMake targets", "Sets environment variables for the command"], correctAnswer: 1, explanation: "DEPENDS lists the files that, if changed, will cause the custom command to re-run. This is how CMake tracks when to regenerate outputs." },
  { moduleId: 9, questionNumber: 3, question: "When using add_custom_command() to generate a source file, how do you include it in a target?", options: ["Use include_generated() to add it", "List the generated file path in add_executable() or add_library()", "Use add_dependencies() to link them", "Generated files are automatically included"], correctAnswer: 1, explanation: "List the generated file's path (usually in CMAKE_CURRENT_BINARY_DIR) directly in add_executable() or add_library(). CMake will know to run the custom command first." },
  { moduleId: 9, questionNumber: 4, question: "What does POST_BUILD mean in add_custom_command(TARGET myapp POST_BUILD ...)?", options: ["The command runs before linking", "The command runs after the target is successfully built", "The command runs during packaging", "The command runs after installation"], correctAnswer: 1, explanation: "POST_BUILD runs after the target is built. PRE_BUILD runs before compilation, PRE_LINK runs before linking." },
  { moduleId: 9, questionNumber: 5, question: "What is the correct way to reference the output directory of a target in a custom command?", options: ["${TARGET_OUTPUT_DIR}", "$<TARGET_FILE_DIR:myapp>", "${CMAKE_BINARY_DIR}/myapp", "${EXECUTABLE_OUTPUT_PATH}"], correctAnswer: 1, explanation: "$<TARGET_FILE_DIR:target> is a generator expression that evaluates to the directory containing the target's output file at build time." },

  // Module 10 - Converting and Cross Compiling
  { moduleId: 10, questionNumber: 1, question: "What is the recommended migration strategy for converting a large project from Makefiles to CMake?", options: ["Big-bang: convert everything at once", "Leaf-first: convert components with no internal dependencies first", "Top-down: convert the main executable first", "Random: convert whichever component is easiest"], correctAnswer: 1, explanation: "Leaf-first migration converts components with no internal dependencies first, then works inward. This allows gradual migration without stopping development." },
  { moduleId: 10, questionNumber: 2, question: "What is the purpose of CMAKE_SYSTEM_NAME in a toolchain file?", options: ["The name of the build machine's OS", "The name of the target platform's OS (e.g., Linux, Windows, Android)", "The name of the CMake build system", "The name of the compiler vendor"], correctAnswer: 1, explanation: "CMAKE_SYSTEM_NAME specifies the target platform's operating system. This tells CMake which platform conventions to use for the cross-compiled output." },
  { moduleId: 10, questionNumber: 3, question: "How do you specify a toolchain file when configuring a CMake project?", options: ["cmake --toolchain toolchain.cmake", "cmake -DCMAKE_TOOLCHAIN_FILE=toolchain.cmake -S . -B build", "cmake -T toolchain.cmake -S . -B build", "cmake --cross-compile toolchain.cmake"], correctAnswer: 1, explanation: "-DCMAKE_TOOLCHAIN_FILE=path/to/toolchain.cmake is the standard way to specify a toolchain file." },
  { moduleId: 10, questionNumber: 4, question: "What does CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY mean in a toolchain file?", options: ["Only find libraries in the system path", "Only find libraries within the sysroot, not on the host system", "Only find static libraries", "Only find libraries that are REQUIRED"], correctAnswer: 1, explanation: "ONLY means CMake will only search for libraries within CMAKE_FIND_ROOT_PATH (the sysroot), not on the host system. This prevents accidentally linking host libraries into the cross-compiled binary." },
  { moduleId: 10, questionNumber: 5, question: "What is the purpose of CMakePresets.json?", options: ["To store CMake's internal configuration", "To define named build configurations that can be shared with the team", "To replace CMakeLists.txt", "To configure IDE settings only"], correctAnswer: 1, explanation: "CMakePresets.json defines named configurations (presets) with specific generators, cache variables, and build directories. It replaces long command-line invocations with simple preset names." },

  // Module 11 - CPack
  { moduleId: 11, questionNumber: 1, question: "What must appear AFTER all set(CPACK_*) calls in CMakeLists.txt?", options: ["cpack_configure()", "include(CPack)", "add_package()", "enable_packaging()"], correctAnswer: 1, explanation: "include(CPack) must come after all CPACK_* variable settings because it reads those variables when included. Variables set after include(CPack) may be ignored." },
  { moduleId: 11, questionNumber: 2, question: "Which CPack generator creates a Debian package?", options: ["cpack -G DEBIAN", "cpack -G DEB", "cpack -G APT", "cpack -G LINUX"], correctAnswer: 1, explanation: "cpack -G DEB creates a .deb package. Other generators: RPM, NSIS (Windows installer), DragNDrop (macOS .dmg), TGZ (tarball), ZIP." },
  { moduleId: 11, questionNumber: 3, question: "What is the relationship between install() rules and CPack?", options: ["CPack ignores install() rules", "CPack uses the install() rules to determine what to include in packages", "install() and CPack are completely independent", "CPack only uses COMPONENT-tagged install() rules"], correctAnswer: 1, explanation: "CPack reads your install() rules to determine what files to include in the package. This is why you must write proper install() rules before CPack will work correctly." },
  { moduleId: 11, questionNumber: 4, question: "How do you create separate packages for runtime and development components?", options: ["Use separate CMakeLists.txt files", "Use the COMPONENT keyword in install() and set CPACK_COMPONENTS_ALL", "Create separate CPack configuration files", "Use different build types"], correctAnswer: 1, explanation: "Tag install() rules with COMPONENT names, then set CPACK_COMPONENTS_ALL to list the components. CPack can then create separate packages per component." },
  { moduleId: 11, questionNumber: 5, question: "What command runs CPack to create packages from the build directory?", options: ["cmake --package build", "cd build && cpack", "cmake --install build --package", "cpack --build build"], correctAnswer: 1, explanation: "Navigate to the build directory and run cpack. You can specify a generator with -G, e.g., cpack -G DEB." },

  // Module 12 - CTest
  { moduleId: 12, questionNumber: 1, question: "What command must appear in CMakeLists.txt before add_test() calls?", options: ["include(CTest) or enable_testing()", "find_package(CTest)", "add_testing()", "cmake_enable_tests()"], correctAnswer: 0, explanation: "enable_testing() or include(CTest) must be called before any add_test() calls. include(CTest) also sets up CDash submission." },
  { moduleId: 12, questionNumber: 2, question: "How do you run only tests with the label 'unit' using ctest?", options: ["ctest --test-dir build --label unit", "ctest --test-dir build -L unit", "ctest --test-dir build --filter unit", "ctest --test-dir build -N unit"], correctAnswer: 1, explanation: "-L pattern filters tests by label. Labels are set with set_tests_properties(test PROPERTIES LABELS 'unit')." },
  { moduleId: 12, questionNumber: 3, question: "What does gtest_discover_tests() do compared to add_test()?", options: ["It's faster", "It automatically discovers all TEST() and TEST_F() macros and registers them as individual CTest tests", "It only works with GoogleTest", "It generates test reports automatically"], correctAnswer: 1, explanation: "gtest_discover_tests() runs the test executable with --gtest_list_tests to discover all test cases and registers each one as a separate CTest test, enabling per-test filtering and reporting." },
  { moduleId: 12, questionNumber: 4, question: "How do you set a 30-second timeout for a test?", options: ["add_test(NAME MyTest COMMAND mytest TIMEOUT 30)", "set_tests_properties(MyTest PROPERTIES TIMEOUT 30)", "ctest --timeout 30 -R MyTest", "Both B and C work"], correctAnswer: 3, explanation: "set_tests_properties(MyTest PROPERTIES TIMEOUT 30) sets a per-test timeout. ctest --timeout sets a global timeout for all tests." },
  { moduleId: 12, questionNumber: 5, question: "What is the purpose of PASS_REGULAR_EXPRESSION in set_tests_properties()?", options: ["It filters which tests to run", "A test passes only if its output matches the given regex pattern", "It sets the test's display name", "It validates the test executable exists"], correctAnswer: 1, explanation: "PASS_REGULAR_EXPRESSION makes a test pass only if its stdout/stderr matches the regex. Useful for tests that print 'PASS' or 'SUCCESS' instead of using exit codes." },

  // Module 13 - CDash
  { moduleId: 13, questionNumber: 1, question: "What file configures CDash submission settings for a project?", options: ["CDashConfig.cmake", "CTestConfig.cmake", "CMakeDashboard.cmake", "SubmitConfig.cmake"], correctAnswer: 1, explanation: "CTestConfig.cmake in the source root contains CTEST_DROP_SITE, CTEST_DROP_LOCATION, and other CDash submission settings." },
  { moduleId: 13, questionNumber: 2, question: "What are the three CDash dashboard tracks?", options: ["Debug, Release, Production", "Experimental, Nightly, Continuous", "Unit, Integration, System", "Local, Staging, Production"], correctAnswer: 1, explanation: "Experimental: developer testing. Nightly: automated nightly builds. Continuous: triggered by commits. Each appears in a separate section of the CDash dashboard." },
  { moduleId: 13, questionNumber: 3, question: "What does 'ctest --test-dir build -D Experimental' do?", options: ["Runs tests in experimental mode only", "Performs a full configure-build-test-submit cycle to the Experimental dashboard", "Enables experimental CMake features", "Runs tests without submitting results"], correctAnswer: 1, explanation: "-D Experimental triggers the full CDash submission workflow: start, configure, build, test, and submit — all in one command." },
  { moduleId: 13, questionNumber: 4, question: "What information does CDash display beyond simple pass/fail?", options: ["Only pass/fail counts", "Build warnings, errors, test history, trends, coverage, and memory errors", "Only timing information", "Only the test output"], correctAnswer: 1, explanation: "CDash shows build warnings/errors, test results with history, code coverage, memory errors (Valgrind/ASan), and trends over time." },
  { moduleId: 13, questionNumber: 5, question: "What is a CTest script used for?", options: ["Replacing CMakeLists.txt", "Automating complex CDash submission workflows with full control over each step", "Writing unit tests", "Configuring CPack"], correctAnswer: 1, explanation: "CTest scripts (run with ctest -S script.cmake) automate the full CDash workflow with fine-grained control: ctest_start(), ctest_configure(), ctest_build(), ctest_test(), ctest_submit()." },

  // Module 14 - CMake Tutorial
  { moduleId: 14, questionNumber: 1, question: "What does the generator expression $<BUILD_INTERFACE:path> do?", options: ["Builds the interface library", "Provides the path only when the target is used from the build tree", "Generates the build interface file", "Sets the interface for build tools"], correctAnswer: 1, explanation: "$<BUILD_INTERFACE:path> evaluates to 'path' when the target is consumed from the build tree. $<INSTALL_INTERFACE:path> evaluates to 'path' when consumed after installation." },
  { moduleId: 14, questionNumber: 2, question: "Why is $<BUILD_INTERFACE:...> vs $<INSTALL_INTERFACE:...> important for installed libraries?", options: ["Performance optimization", "The include path is different in the build tree vs the installed location", "It's required by the C++ standard", "It enables cross-compilation"], correctAnswer: 1, explanation: "In the build tree, headers are at the source directory. After installation, they're at the install prefix. These generator expressions provide the correct path in each context." },
  { moduleId: 14, questionNumber: 3, question: "What does the EXPORT keyword in install(TARGETS ... EXPORT MyTargets) do?", options: ["Exports the target to a global registry", "Associates the target with a named export set for generating CMake config files", "Makes the target publicly visible", "Exports compile flags"], correctAnswer: 1, explanation: "EXPORT associates the target with a named export set. Later, install(EXPORT MyTargets ...) generates a MyTargets.cmake file that consumers can include." },
  { moduleId: 14, questionNumber: 4, question: "What is the purpose of configure_package_config_file()?", options: ["Configures the CPack package", "Generates a proper CMake Config file with correct path handling for installation", "Configures the build type", "Creates the package version file"], correctAnswer: 1, explanation: "configure_package_config_file() processes a .cmake.in template and generates a Config.cmake file with proper @PACKAGE_INIT@ path handling for both build and install trees." },
  { moduleId: 14, questionNumber: 5, question: "What does write_basic_package_version_file() generate?", options: ["The main package config file", "A version compatibility file that find_package() uses to check version requirements", "The package changelog", "The package's README"], correctAnswer: 1, explanation: "write_basic_package_version_file() generates XxxConfigVersion.cmake which find_package() uses to check if the installed version satisfies the requested version constraint." },

  // Module 15 - User Interaction Guide
  { moduleId: 15, questionNumber: 1, question: "What is the main advantage of CMakePresets.json over command-line -D flags?", options: ["Presets are faster to process", "Presets are named, shareable, version-controlled configurations that replace long command-line invocations", "Presets support more options than -D flags", "Presets are required for modern CMake"], correctAnswer: 1, explanation: "CMakePresets.json defines named configurations that can be committed to version control and shared with the team, replacing documentation like 'run cmake with these 12 flags'." },
  { moduleId: 15, questionNumber: 2, question: "How do you list available CMake presets?", options: ["cmake --show-presets", "cmake --list-presets", "cmake --presets", "cmake -P list"], correctAnswer: 1, explanation: "cmake --list-presets shows all available configure presets. cmake --build --list-presets shows build presets." },
  { moduleId: 15, questionNumber: 3, question: "What does the 'inherits' key in a CMakePresets.json preset do?", options: ["Inherits from a parent project's presets", "Copies all settings from another preset, allowing overrides", "Inherits the build type from the environment", "Inherits compiler settings from the system"], correctAnswer: 1, explanation: "'inherits' allows a preset to copy all settings from another preset and selectively override them. This enables DRY (Don't Repeat Yourself) preset configurations." },
  { moduleId: 15, questionNumber: 4, question: "What is the difference between option() and set(VAR value CACHE BOOL 'help')?", options: ["option() is for strings, set() is for booleans", "option() is shorthand for a BOOL cache variable with a default of OFF; they are functionally equivalent", "set() with CACHE is deprecated", "option() cannot be overridden from the command line"], correctAnswer: 1, explanation: "option(VAR 'help' OFF) is exactly equivalent to set(VAR OFF CACHE BOOL 'help'). option() is the idiomatic, more readable form for boolean configuration options." },
  { moduleId: 15, questionNumber: 5, question: "How do you configure a project using a preset named 'release'?", options: ["cmake -P release -S . -B build", "cmake --preset release", "cmake --config release -S . -B build", "cmake -DPRESET=release -S . -B build"], correctAnswer: 1, explanation: "cmake --preset <name> configures the project using the named preset. The preset defines the generator, binary directory, and cache variables." },

  // Module 16 - Using Dependencies
  { moduleId: 16, questionNumber: 1, question: "What is the key advantage of FetchContent over requiring users to install dependencies?", options: ["FetchContent is faster", "FetchContent downloads and integrates dependencies automatically, ensuring reproducible builds", "FetchContent works offline", "FetchContent is required for modern CMake"], correctAnswer: 1, explanation: "FetchContent downloads dependencies at configure time and makes them available as regular CMake targets, ensuring everyone builds with the exact same version." },
  { moduleId: 16, questionNumber: 2, question: "When should you pin FetchContent dependencies to a specific GIT_TAG?", options: ["Only for release builds", "Always — never use branch names like 'main' as they are moving targets", "Only for external dependencies", "Only when using CI/CD"], correctAnswer: 1, explanation: "Always pin to a specific tag or commit hash. Using 'main' or 'master' means different developers may get different versions, breaking reproducibility." },
  { moduleId: 16, questionNumber: 3, question: "What is the recommended pattern when you want to use a system-installed package but fall back to FetchContent?", options: ["Always use FetchContent", "Try find_package() first; if not found, use FetchContent_Declare and FetchContent_MakeAvailable", "Always use find_package()", "Use ExternalProject_Add"], correctAnswer: 1, explanation: "find_package(Xxx QUIET) first, then check Xxx_FOUND. If not found, use FetchContent to download it. This respects system installations while ensuring availability." },
  { moduleId: 16, questionNumber: 4, question: "What is the difference between FetchContent and ExternalProject?", options: ["FetchContent is for C libraries, ExternalProject is for C++", "FetchContent integrates at configure time; ExternalProject builds at build time in a separate tree", "ExternalProject is deprecated", "There is no practical difference"], correctAnswer: 1, explanation: "FetchContent makes dependencies available as regular CMake targets in your build. ExternalProject builds them separately at build time, useful for complex or non-CMake dependencies." },
  { moduleId: 16, questionNumber: 5, question: "How do you prevent a FetchContent dependency from adding its install rules to your project?", options: ["Use FetchContent_Declare with NO_INSTALL", "Set the dependency's INSTALL option to OFF before FetchContent_MakeAvailable", "Use EXCLUDE_FROM_ALL in FetchContent_Declare", "It's not possible to prevent this"], correctAnswer: 1, explanation: "Set the dependency's install option (e.g., set(FMT_INSTALL OFF CACHE BOOL '' FORCE)) before FetchContent_MakeAvailable() to prevent its install rules from being added to your project." },

  // Module 17 - Importing and Exporting
  { moduleId: 17, questionNumber: 1, question: "What is the purpose of the NAMESPACE argument in install(EXPORT ...)?", options: ["It creates a C++ namespace", "It prefixes exported target names to prevent collisions (e.g., MyLib::mylib)", "It sets the package namespace in the registry", "It's required for cross-platform builds"], correctAnswer: 1, explanation: "NAMESPACE prefixes all exported target names. MyLib:: prefix means consumers use MyLib::mylib, making it clear which package the target belongs to and preventing name collisions." },
  { moduleId: 17, questionNumber: 2, question: "What three files constitute a complete CMake Config Package?", options: ["CMakeLists.txt, CMakeCache.txt, CMakeInstall.cmake", "XxxConfig.cmake, XxxConfigVersion.cmake, XxxTargets.cmake", "FindXxx.cmake, XxxConfig.cmake, XxxVersion.cmake", "XxxConfig.cmake, XxxInstall.cmake, XxxExport.cmake"], correctAnswer: 1, explanation: "XxxConfig.cmake (main config), XxxConfigVersion.cmake (version compatibility), and XxxTargets.cmake (exported targets with their properties)." },
  { moduleId: 17, questionNumber: 3, question: "What does @PACKAGE_INIT@ in a Config.cmake.in template do?", options: ["Initializes the package registry", "Provides helper macros and sets up path variables for the installed package", "Initializes the C++ package manager", "Sets the package version"], correctAnswer: 1, explanation: "@PACKAGE_INIT@ is replaced by configure_package_config_file() with code that sets up PACKAGE_PREFIX_DIR and provides the set_and_check() and check_required_components() macros." },
  { moduleId: 17, questionNumber: 4, question: "What compatibility mode should you use for a library that follows semantic versioning?", options: ["ExactVersion", "AnyNewerVersion", "SameMajorVersion", "SameMinorVersion"], correctAnswer: 2, explanation: "SameMajorVersion is correct for semantic versioning: any version with the same major number is compatible. AnyNewerVersion is too permissive (ignores breaking changes)." },
  { moduleId: 17, questionNumber: 5, question: "Where should XxxConfig.cmake be installed for find_package() to find it automatically?", options: ["In /usr/include/Xxx/", "${CMAKE_INSTALL_LIBDIR}/cmake/Xxx/", "In the system PATH", "In ${CMAKE_INSTALL_BINDIR}/"], correctAnswer: 1, explanation: "CMake searches ${CMAKE_INSTALL_LIBDIR}/cmake/Xxx/ (and other standard locations) for XxxConfig.cmake. Installing there ensures find_package(Xxx) works without setting Xxx_DIR." },

  // Module 18 - IDE Integration
  { moduleId: 18, questionNumber: 1, question: "What CMake variable generates compile_commands.json for IDE IntelliSense?", options: ["CMAKE_GENERATE_COMPILE_COMMANDS", "CMAKE_EXPORT_COMPILE_COMMANDS", "CMAKE_IDE_COMPILE_COMMANDS", "CMAKE_COMPILE_COMMANDS_EXPORT"], correctAnswer: 1, explanation: "set(CMAKE_EXPORT_COMPILE_COMMANDS ON) or -DCMAKE_EXPORT_COMPILE_COMMANDS=ON generates compile_commands.json in the build directory." },
  { moduleId: 18, questionNumber: 2, question: "Which VS Code extension provides native CMake support?", options: ["C/C++ Extension", "CMake Tools", "CMake Integration", "Build Tools for VS Code"], correctAnswer: 1, explanation: "The CMake Tools extension (by Microsoft) provides CMake integration in VS Code: configure, build, test, debug, and preset support." },
  { moduleId: 18, questionNumber: 3, question: "How do you generate an Xcode project from a CMake project?", options: ["cmake -G Xcode -S . -B build-xcode", "cmake --xcode -S . -B build-xcode", "xcodebuild -cmake .", "cmake -DXCODE=ON -S . -B build-xcode"], correctAnswer: 0, explanation: "cmake -G Xcode -S . -B build-xcode generates an Xcode project. Then open build-xcode/ProjectName.xcodeproj in Xcode." },
  { moduleId: 18, questionNumber: 4, question: "What file should you add to .gitignore to avoid committing IDE-specific files?", options: ["CMakeLists.txt", "CMakePresets.json", "Build directories and IDE-specific directories like .vscode/, .idea/, cmake-build-*/", "compile_commands.json"], correctAnswer: 2, explanation: "Build directories (build/, cmake-build-*/) and IDE directories (.vscode/, .idea/) should be gitignored. CMakeLists.txt and CMakePresets.json should be committed." },
  { moduleId: 18, questionNumber: 5, question: "What does compile_commands.json enable beyond IntelliSense?", options: ["Faster compilation", "Tools like clangd, clang-tidy, and include-what-you-use to analyze your code", "Automatic code formatting", "Cross-compilation support"], correctAnswer: 1, explanation: "compile_commands.json is a compilation database used by clangd (language server), clang-tidy (linter), include-what-you-use, and other static analysis tools." },

  // Module 19 - Advanced Techniques
  { moduleId: 19, questionNumber: 1, question: "Why are generator expressions necessary for multi-config generators like Visual Studio?", options: ["Visual Studio requires them", "The build type (Debug/Release) is not known at configure time with multi-config generators", "They are faster than if() statements", "They are required by the CMake standard"], correctAnswer: 1, explanation: "With multi-config generators, you configure once and build multiple configurations. The build type isn't known at configure time, so $<CONFIG:Debug> is evaluated at build time." },
  { moduleId: 19, questionNumber: 2, question: "What does $<$<CONFIG:Release>:value> evaluate to in a Debug build?", options: ["value", "empty string", "0", "undefined"], correctAnswer: 1, explanation: "$<$<CONFIG:Release>:value> evaluates to 'value' in Release builds and to an empty string in all other configurations." },
  { moduleId: 19, questionNumber: 3, question: "What generator expression gives the full path to a target's output file?", options: ["${TARGET_FILE:myapp}", "$<TARGET_FILE:myapp>", "${CMAKE_BINARY_DIR}/myapp", "$<TARGET_PATH:myapp>"], correctAnswer: 1, explanation: "$<TARGET_FILE:target> evaluates to the full path of the target's primary output file (executable or library) at build time." },
  { moduleId: 19, questionNumber: 4, question: "How do you enable Link Time Optimization (LTO) only in Release builds for GCC?", options: ["if(CMAKE_BUILD_TYPE STREQUAL Release) target_compile_options(... -flto)", "target_compile_options(myapp PRIVATE $<$<AND:$<CONFIG:Release>,$<NOT:$<CXX_COMPILER_ID:MSVC>>>:-flto>)", "set(CMAKE_INTERPROCEDURAL_OPTIMIZATION_RELEASE ON)", "Both B and C are correct"], correctAnswer: 3, explanation: "Both approaches work. set(CMAKE_INTERPROCEDURAL_OPTIMIZATION_RELEASE ON) is the simplest. The generator expression approach gives more control over which compilers get LTO." },
  { moduleId: 19, questionNumber: 5, question: "What is the difference between configure-time evaluation and build-time evaluation in CMake?", options: ["There is no difference", "Configure-time runs when cmake is invoked; build-time runs when the compiler runs. Generator expressions bridge the gap.", "Build-time is always faster", "Configure-time only applies to cache variables"], correctAnswer: 1, explanation: "Configure-time: CMake processes CMakeLists.txt. Build-time: the compiler/linker runs. Generator expressions ($<...>) are evaluated at build time, enabling build-type-specific settings." },

  // Module 20 - Final Exam
  { moduleId: 20, questionNumber: 1, question: "What is the complete CMake workflow for a production project?", options: ["Write code → Compile → Ship", "Configure → Build → Test → Package → Install", "cmake → make → install", "Write CMakeLists.txt → cmake → ctest → cpack → cdash submit"], correctAnswer: 3, explanation: "The complete workflow: Write CMakeLists.txt → cmake (configure) → cmake --build (build) → ctest (test) → cpack (package) → optionally submit to CDash." },
  { moduleId: 20, questionNumber: 2, question: "Which combination of commands represents a complete CI pipeline using CMake tools?", options: ["cmake && make && test", "cmake --preset ci && cmake --build --preset ci && ctest --preset ci && cpack", "cmake -S . -B build && make && ./run_tests", "cmake . && cmake --build . && ctest ."], correctAnswer: 1, explanation: "cmake --preset ci (configure) → cmake --build --preset ci (build) → ctest --preset ci (test) → cpack (package). Using presets ensures reproducibility." },
  { moduleId: 20, questionNumber: 3, question: "A colleague says 'just use include_directories() and link_libraries(), it's simpler.' What is the correct response?", options: ["They are correct, it is simpler", "These are directory-scoped commands that pollute all targets. Use target_include_directories() and target_link_libraries() with proper visibility keywords.", "It depends on the project size", "Both approaches are equally valid in modern CMake"], correctAnswer: 1, explanation: "Directory-scoped commands (include_directories, link_libraries) are legacy CMake. They pollute all targets and make dependency management opaque. Always use target-scoped commands." },
  { moduleId: 20, questionNumber: 4, question: "You need your library to work both from the build tree and after installation. Which feature handles the different include paths?", options: ["CMAKE_INCLUDE_PATH variable", "$<BUILD_INTERFACE:...> and $<INSTALL_INTERFACE:...> generator expressions", "install(INCLUDE DIRECTORIES ...)", "RPATH settings"], correctAnswer: 1, explanation: "$<BUILD_INTERFACE:path> provides the source-tree path during development. $<INSTALL_INTERFACE:path> provides the installed path after cmake --install. Both are set in target_include_directories()." },
  { moduleId: 20, questionNumber: 5, question: "What is the single most important principle of modern CMake?", options: ["Always use Ninja as the generator", "Think in targets and their relationships, not in directories and flags", "Always set cmake_minimum_required to the latest version", "Always use out-of-source builds"], correctAnswer: 1, explanation: "Modern CMake is target-centric. Targets are the fundamental unit. Their relationships (via target_link_libraries) define the build graph. Everything else — include paths, compile flags, definitions — flows from target relationships." },
];

// ============ INFOGRAPHIC URLS ============
const INFOGRAPHIC_URLS = {
  1: "/manus-storage/module-01-why-cmake_1fefc1b0.png",
  2: "/manus-storage/module-02-getting-started_f4e0d768.png",
  3: "/manus-storage/module-03-cmakelists_7ab1be3f.png",
  4: "/manus-storage/module-04-cache_0c5bbddd.png",
  5: "/manus-storage/module-05-key-concepts_475a60a3.png",
  6: "/manus-storage/module-06-modules_c993b66d.png",
  7: "/manus-storage/module-07-installing_bda80c05.png",
  8: "/manus-storage/module-08-system-inspection_90cceb29.png",
  9: "/manus-storage/module-09-finding-packages_d99e8958.png",
  10: "/manus-storage/module-10-custom-commands_525f4ecd.png",
  11: "/manus-storage/module-11-converting_2f03ef25.png",
  12: "/manus-storage/module-12-cross-compiling_aaf8d9a7.png",
  13: "/manus-storage/module-13-cpack_4a887909.png",
  14: "/manus-storage/module-14-ctest_01e31b5c.png",
  15: "/manus-storage/module-15-cdash_9e2eb338.png",
  16: "/manus-storage/module-16-tutorial_4cd34400.png",
  17: "/manus-storage/module-17-user-interaction_6e9fb400.png",
  18: "/manus-storage/module-18-dependencies_2377768e.png",
  19: "/manus-storage/module-19-import-export_03b7baf8.png",
  20: "/manus-storage/module-20-ide-integration_bbee844d.png",
};

// ============ SEEDING LOGIC ============
async function seedCmakeModules() {
  console.log("🚀 Starting CMake Mastery Course seeding...\n");

  // Check if tables exist
  try {
    const existing = await db.execute("SELECT COUNT(*) as count FROM cmake_modules");
    const count = existing[0][0].count;
    if (count > 0) {
      console.log(`⚠️  cmake_modules table already has ${count} rows. Skipping module seeding.`);
      console.log("   To re-seed, truncate the cmake_modules table first.\n");
    } else {
      console.log("📚 Seeding CMake modules...");
      for (const module of CMAKE_MODULES) {
        await db.execute(
          `INSERT INTO cmake_modules (moduleNumber, cmakeTrack, title, subtitle, sparkContent, cruciblePrompt, crucibleSample, imprintContent, estimatedMinutes, visualAidUrl, shockImageUrl)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            module.moduleNumber,
            module.track,
            module.title,
            module.subtitle || null,
            module.sparkContent || null,
            module.cruciblePrompt || null,
            module.crucibleSample || null,
            module.imprintContent || null,
            module.estimatedMinutes || 15,
            INFOGRAPHIC_URLS[module.moduleNumber] || null,
            INFOGRAPHIC_URLS[module.moduleNumber] || null,
          ]
        );
        console.log(`  ✅ Module ${module.moduleNumber}: ${module.title}`);
      }
      console.log(`\n✅ Seeded ${CMAKE_MODULES.length} modules.\n`);
    }
  } catch (err) {
    console.error("❌ Error seeding modules:", err.message);
    console.log("   Make sure you have run the database migration first.\n");
    process.exit(1);
  }

  // Seed quiz questions
  try {
    const existing = await db.execute("SELECT COUNT(*) as count FROM cmake_quiz_questions");
    const count = existing[0][0].count;
    if (count > 0) {
      console.log(`⚠️  cmake_quiz_questions table already has ${count} rows. Skipping quiz seeding.\n`);
    } else {
      console.log("❓ Seeding quiz questions...");
      // Get module IDs
      const modules = await db.execute("SELECT id, moduleNumber FROM cmake_modules ORDER BY moduleNumber");
      const moduleMap = {};
      for (const row of modules[0]) {
        moduleMap[row.moduleNumber] = row.id;
      }

      for (const q of QUIZ_QUESTIONS) {
        const moduleId = moduleMap[q.moduleId];
        if (!moduleId) {
          console.warn(`  ⚠️  No module found for moduleId ${q.moduleId}`);
          continue;
        }
        await db.execute(
          `INSERT INTO cmake_quiz_questions (moduleId, questionNumber, question, options, correctAnswer, explanation)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            moduleId,
            q.questionNumber,
            q.question,
            JSON.stringify(q.options),
            q.correctAnswer,
            q.explanation || null,
          ]
        );
      }
      console.log(`  ✅ Seeded ${QUIZ_QUESTIONS.length} quiz questions.\n`);
    }
  } catch (err) {
    console.error("❌ Error seeding quiz questions:", err.message);
    process.exit(1);
  }

  console.log("🎉 CMake Mastery Course seeding complete!");
  console.log("   20 modules × 5 questions = 100 quiz questions total\n");
  await connection.end();
}

seedCmakeModules().catch(console.error);
