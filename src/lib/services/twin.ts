
const latestReadTwinPostKey = "latestReadTwinIssue"

export function getLatestReadTwinPost(): number | null {
  const read = localStorage.getItem(latestReadTwinPostKey)
  return read ? Number(read) : null
}

export function updateLatestReadTwinPost(issue: number) {
  const latest = getLatestReadTwinPost()
  if (!latest || issue > latest) {
    localStorage.setItem(latestReadTwinPostKey, issue.toString())
  }
}
