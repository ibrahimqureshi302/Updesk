QUERY = """
query {
  contracts(filter: { status: ACTIVE }) {
    id
    client {
      id
      name
      email
      country
      companyName
      totalHires
      totalReviews
    }
  }
}
"""
