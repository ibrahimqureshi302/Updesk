QUERY = """
query {
  proposals {
    id
    status
    coverLetter
    submittedAt
    bidAmount { amount currencyCode }
    job {
      id
      title
      jobType
      budget { amount currencyCode }
    }
  }
}
"""
