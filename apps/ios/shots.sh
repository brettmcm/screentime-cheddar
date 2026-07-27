#!/bin/bash
# Screenshots one or more screens from the booted simulator.
# A screen name takes "+deposit"/"+transfer" to open the money sheet over it, and ":bottom"
# to capture it scrolled to the end — e.g. `shots.sh goal-detail+deposit profile:bottom`.
set -e
DEV=3A0B60A0-8667-4A0E-9960-80C7E995706C
APP=/Users/cbergman/Library/Developer/Xcode/DerivedData/Cheddar-cobmsbxjtstvqacisfsvenlrxhve/Build/Products/Debug-iphonesimulator/Cheddar.app

cd "$(dirname "$0")"
if [ "$1" = "--build" ]; then
  shift
  xcodebuild -project Cheddar.xcodeproj -scheme Cheddar \
    -destination 'platform=iOS Simulator,name=iPhone 17 Pro' -quiet build 2>&1 | rg "error:" && exit 1
  xcrun simctl install $DEV "$APP"
fi

for arg in "$@"; do
  head="${arg%%:*}"
  scroll=""
  [ "$arg" != "$head" ] && scroll="bottom"
  screen="${head%%+*}"
  sheet=""
  [ "$head" != "$screen" ] && sheet="${head#*+}"

  xcrun simctl terminate $DEV com.screentime.cheddar >/dev/null 2>&1 || true
  SIMCTL_CHILD_CHEDDAR_START_SCREEN=$screen SIMCTL_CHILD_CHEDDAR_SCROLL=$scroll \
    SIMCTL_CHILD_CHEDDAR_START_SHEET=$sheet \
    xcrun simctl launch $DEV com.screentime.cheddar >/dev/null
  sleep 2.5
  xcrun simctl io $DEV screenshot --type=png \
    "/tmp/shots/ios-$screen${sheet:+-$sheet}${scroll:+-bottom}.png" >/dev/null 2>&1
  echo "captured $arg"
done
