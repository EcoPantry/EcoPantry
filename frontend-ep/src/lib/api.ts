export const BASE_API_URL = "http://localhost:3000"
// export const BASE_API_URL = "http://ecopantry-alb-172202900.ap-southeast-1.elb.amazonaws.com/"

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${BASE_API_URL}${endpoint}`)
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json()
  },
  post: async (endpoint: string, data: any) => {
    const res = await fetch(`${BASE_API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to post")
    return res.json()
  },
    put: async (endpoint: string, data: any) => {
        const res = await fetch(`${BASE_API_URL}${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error("Failed to update")
        return res.json()
    },
    delete: async (endpoint: string) => {
        const res = await fetch(`${BASE_API_URL}${endpoint}`, {
        method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to delete")
        return res.json()
    }
}