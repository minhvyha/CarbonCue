import axios from "axios";

type FetchFailure = {
  status: number;
  body: {
    error: string;
    code: string;
    upstreamStatus?: number;
    canUseManualInput: true;
  };
};

export function websiteFetchFailure(error: unknown): FetchFailure {
  const response = axios.isAxiosError(error) ? error.response : undefined;
  const upstreamStatus = response?.status;
  const challenged = response?.headers?.["cf-mitigated"] === "challenge";
  const failure = (status: number, code: string, message: string): FetchFailure => ({
    status,
    body: {
      error: message,
      code,
      ...(upstreamStatus ? { upstreamStatus } : {}),
      canUseManualInput: true,
    },
  });

  if (challenged) {
    return failure(422, "WEBSITE_SECURITY_CHALLENGE",
      "This website's security check blocks automated analysis. Import a browser capture or use the manual page-size option for this site.");
  }
  if (upstreamStatus === 401 || upstreamStatus === 403) {
    return failure(422, "WEBSITE_ACCESS_DENIED",
      `This website denied access to the calculator (HTTP ${upstreamStatus}). Import a browser capture or use the manual page-size option for this site.`);
  }
  if (axios.isAxiosError(error) && ["ECONNABORTED", "ETIMEDOUT"].includes(error.code || "")) {
    return failure(504, "WEBSITE_TIMED_OUT",
      "This website took too long to respond. Try again later or enter its page size manually.");
  }
  return failure(502, "URL_UNREACHABLE", upstreamStatus
    ? `The website returned HTTP ${upstreamStatus}, so its page could not be analyzed. Try again later or enter its page size manually.`
    : "The calculator could not connect to this website. Try again later or enter its page size manually.");
}
