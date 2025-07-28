import { vi } from "vitest";

URL.createObjectURL = vi.fn()
vi.mocked(URL.createObjectURL).mockReturnValue("Url")

// Change the mock return values in the individual tests to change the mock supabase results
const mocks = vi.hoisted(() => {
  return {
    data: vi.fn().mockReturnValue(null),
    error: vi.fn().mockReturnValue(null),
    session: vi.fn(() => ({
      session: {
        access_token: "",
        refresh_token: "",
        expires_in: 0,
        token_type: "",
        user: {
          id: "7a4af5c3-6640-45c3-94a7-d34bd6fbde02",
          app_metadata: {},
          user_metadata: {},
          aud: "",
          created_at: ""
        }
      }, user: {
        id: "7a4af5c3-6640-45c3-94a7-d34bd6fbde02", name: "Test", theme: "", imageFile: "", email: "", createdAt: "",
        accent: "", base: "", created_at: "", profile_image: "", image_file: "", user_id: ""
      }, setUser: () => { }, loading: false
    }))
  }
})

// Mocks the supabase client. Add on more functions if needed
vi.mock("@supabase/supabase-js", () => {
  const createClient = {
    createClient: vi.fn(() => ({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ data: { session: mocks.session().session, user: mocks.session().user }, error: null }),
        onAuthStateChange: vi.fn(),
        getSession: vi.fn().mockImplementation(() => Promise.resolve(({ data: { session: mocks.session() }, error: null })))
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockReturnThis(),
          single: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          data: mocks.data(),
          error: mocks.error()
        })),
        update: vi.fn(() => ({
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockReturnThis(),
          data: {},
          error: null
        }))
      })),
      storage: {
        from: vi.fn(() => ({
          download: vi.fn().mockResolvedValue({ data: mocks.data(), error: mocks.error() })
        }))
      }
    }))
  }
  return createClient
});