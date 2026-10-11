# Prepwise launch checklist

This checklist describes the current site and a safe path from a local preview to a student pilot.

## What works in the current prototype

- DWDM, DAA, and Compiler Design notes are bundled with the website.
- The doubt helper searches those notes in the browser and displays matching unit sections. It is not connected to an AI model.
- Timetable sessions and paper photos are saved in the current browser on the current device.
- Supabase email/password sign-in and signup are connected. User accounts are held by Supabase; timetable sessions and paper photos remain browser-local and do not sync across devices.

## Before inviting students

1. **Review the course material.** Check each subject, unit title, formula, and important question against your official syllabus and class materials. Correct any mistakes before students rely on it.
2. **Check permissions.** Use notes and past-paper photos you created or have permission to publish. Add attribution where required.
3. **Choose a small pilot.** Invite a few classmates first. Ask them to try a subject note, submit a doubt, create a timetable session, and view/add a paper photo. Record confusing screens and incorrect content.
4. **Explain browser-only storage.** Until a backend exists, tell students their timetable and papers stay in that browser/device. They will not follow them to another device and may be lost if browser data is cleared.
5. **Configure Supabase URLs before signup testing.** In Supabase Authentication URL configuration, set the Site URL to the final HTTPS website address and add that address to the redirect URL allow list. Email confirmation and password reset links rely on this setting.
6. **Publish a staging site.** Choose a static host, upload the contents of the `outputs` folder, and test the hosted HTTPS URL on a phone and computer. Keep the local copy as a backup.
7. **Set up secure data policies before syncing student data.** The current login creates accounts, but it does not cloud-sync timetable sessions or paper photos. Enable Row Level Security for any future user data tables, and keep AI credentials on a server, never in browser code.
8. **Invite the pilot group.** Give students a short feedback form and a way to report wrong notes or broken pages. Fix high-impact issues before wider sharing.

## First pilot acceptance checklist

- All three subjects and all five units open.
- Search-based doubt responses identify the subject, unit, and matching section; unrelated questions show a clear no-match message.
- Timetable entries can be added, completed, and removed.
- Previous-paper photos can be added, opened, and removed in the same browser.
- Mobile layout is readable and buttons can be reached by keyboard.
- The site clearly says what is local-only and does not imply that the current doubt helper is an AI model.
- Signup, email confirmation, sign-in, sign-out, and password reset work on the deployed HTTPS URL.

## Current site files

Open `index.html` in a browser for a local preview. Supabase authentication requires the CDN connection and an allowed hosted redirect URL for confirmation/reset emails. Keep `supabase-config.js`, `auth.js`, the subject notes, CSS, and app script beside `index.html` when hosting. The publishable key in `supabase-config.js` is public by design; never add a Supabase secret/service_role key there.
