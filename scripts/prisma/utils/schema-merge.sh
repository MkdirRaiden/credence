#!/usr/bin/env bash
# schema-merge.sh — Merge multiple Prisma schema files safely
set -euo pipefail

: "${SCHEMA_MERGE_LOADED:=0}"
if (( SCHEMA_MERGE_LOADED == 0 )); then
  SCHEMA_MERGE_LOADED=1
  export SCHEMA_MERGE_LOADED

  # Merge function
  merge_prisma_files() {
    local output="$1"
    shift
    local files=("$@")

    if (( ${#files[@]} == 0 )); then
      log_warn "No Prisma files provided to merge. Skipping: $output"
      return 0
    fi

    mkdir -p "$(dirname "$output")"
    > "$output"
    log_info "Merging Prisma files into: $output"

    for f in "${files[@]}"; do
      if [[ ! -f "$f" ]]; then
        log_warn "Skipping missing file: $f"
        continue
      fi

      if [[ "$(basename "$f")" == "base.prisma" ]]; then
        cat "$f" >> "$output"
      else
        # Remove empty lines
        sed '/^[[:space:]]*$/d' "$f" >> "$output"
      fi
      echo >> "$output"
    done

    log_info "✅ Prisma schema merged successfully: $output"
  }

  # Export for subshells
  export -f merge_prisma_files
fi