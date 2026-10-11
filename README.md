# Prepwise

A static study site for JNTU-GV B.Tech CSE R23 III Year I Semester students, with notes for DWDM, DAA, and Compiler Design, plus a timetable, previous-paper photo library, search, and note-grounded doubt helper.

## Publish with GitHub Pages

1. Keep all site files in the repository root.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, then save.
4. After GitHub Pages provides the HTTPS address, add it as the **Site URL** and in the **Redirect URLs** allow list under Supabase **Authentication → URL Configuration**.

## Authentication and data

- Email/password authentication uses Supabase. The publishable key in `supabase-config.js` is intended for browser use. Never add a Supabase secret or `service_role` key to this static site.
- Timetable sessions and uploaded paper photos are currently stored in the student's browser on that device; they do not sync to other devices.
- The doubt helper searches local course notes. It does not call an AI model.
- Only publish course content and past-paper photos you have permission to share.

See `LAUNCH-CHECKLIST.md` before inviting students.
