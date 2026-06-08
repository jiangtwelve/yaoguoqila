const MIN_PULL_DOWN_REFRESH_MS = 520;
const FAILED_REFRESH_VISIBLE_MS = 900;

export const MOCK_PULL_DOWN_REFRESH_FAILURE = false;

export async function waitForMinimumRefreshIndicator(startedAt: number) {
  const elapsed = Date.now() - startedAt;
  const remaining = Math.max(0, MIN_PULL_DOWN_REFRESH_MS - elapsed);

  if (remaining > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, remaining);
    });
  }
}

export async function waitForFailedRefreshIndicator() {
  await new Promise((resolve) => {
    setTimeout(resolve, FAILED_REFRESH_VISIBLE_MS);
  });
}
