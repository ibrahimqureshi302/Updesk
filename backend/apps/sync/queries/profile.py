QUERY = """
query {
  freelancerProfile {
    id
    name
    email
    title
    description
    jobSuccessScore
    totalJobs
    memberSince
    connectsBalance
    profileUrl
    hourlyRate   { amount currencyCode }
    totalEarnings { amount currencyCode }
    skills { name level }
  }
}
"""
