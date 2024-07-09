#!/usr/bin/env bash
set -e

# Needed because if it is set, cd may print the path it changed to.
unset CDPATH

function setupNaytive() {
	NODE="node"
	NAYTIVE_TOOLS="$NAYTIVE_ROOT/dist/index.cjs"

	# Test if running as superuser – but don't warn if running within Docker or CI.
	if [[ "$EUID" == "0" && ! -f /.dockerenv && "$CI" != "true" && "$BOT" != "true" && "$CONTINUOUS_INTEGRATION" != "true" ]]; then
		>&2 echo "✋ Woah! You appear to be trying to run naytive as root."
		>&2 echo "   We strongly recommend running the naytive tool without superuser privileges."
		>&2 echo "  "
	fi

	# Test if Git is available on the Host
	if ! hash git 2>/dev/null; then
		>&2 echo "Error: Unable to find git in your PATH."
		exit 1
	fi

	BIN_NAME="$(basename "$PROG_NAME")"
	case "$BIN_NAME" in
		naytive*)
			"$NODE" "$NAYTIVE_TOOLS" "$@"
			;;
		*)
			>&2 echo "Error! Executable name $BIN_NAME not recognized!"
			exit 1
			;;
	esac
}
