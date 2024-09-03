import RepoHeader from "@/components/repoHeader"

export default function Repository({ children }) {
  return (
    <>
      <RepoHeader />
      {children}
    </>
  )
}
