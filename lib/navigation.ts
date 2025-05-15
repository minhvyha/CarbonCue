"use client"

export function triggerNavigationStart() {
  document.dispatchEvent(new Event("navigationStart"))
}

export function triggerNavigationComplete() {
  document.dispatchEvent(new Event("navigationComplete"))
}
