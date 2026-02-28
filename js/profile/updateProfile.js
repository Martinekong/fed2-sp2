import NoroffAPI from './../api.js';
import {
  displayOverlay,
  createOverlayForm,
  createInputDiv,
  createSubmitButton,
  createButton,
  removeStackedOverlays,
} from './../utils/overlay.js';

const api = new NoroffAPI();

function buildProfileForm(user) {
  const fields = [
    {
      name: 'bio',
      options: {
        value: user.bio || '',
        placeholder: 'Tell people about yourself',
      },
    },
    {
      name: 'avatarUrl',
      options: {
        labelText: 'Avatar URL',
        type: 'url',
        value: user.avatar?.url || '',
        placeholder: 'Enter valid URL for avatar image',
      },
    },
    {
      name: 'avatarAlt',
      options: {
        labelText: 'Avatar Alt',
        value: user.avatar?.alt || '',
        placeholder: 'Describe your avatar',
      },
    },
    {
      name: 'bannerUrl',
      options: {
        labelText: 'Banner URL',
        type: 'url',
        value: user.banner?.url || '',
        placeholder: 'Enter valid URL for banner image',
      },
    },
    {
      name: 'bannerAlt',
      options: {
        labelText: 'Banner Alt',
        value: user.banner?.alt || '',
        placeholder: 'Describe your banner',
      },
    },
  ];

  const inputs = fields.map((f) => createInputDiv(f.name, f.options));
  const submitBtn = createSubmitButton('save changes');

  return createOverlayForm([...inputs, submitBtn]);
}

function cleanMedia(url, alt) {
  const cleanUrl = (url || '').trim();
  const cleanAlt = (alt || '').trim();

  if (!cleanUrl) return undefined;

  return {
    url: cleanUrl,
    alt: cleanAlt || undefined,
  };
}

function getUpdates(form) {
  const formData = new FormData(form);

  const bio = (formData.get('bio') || '').trim();
  const avatar = cleanMedia(
    formData.get('avatarUrl'),
    formData.get('avatarAlt'),
  );
  const banner = cleanMedia(
    formData.get('bannerUrl'),
    formData.get('bannerAlt'),
  );

  const updates = { bio };

  if (avatar) updates.avatar = avatar;
  if (banner) updates.banner = banner;

  return updates;
}

function onProfileSubmit(form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) {
      const button = createButton(false);
      displayOverlay('Something went wrong: missing submit button', button);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'updating...';

    try {
      const updates = getUpdates(form);
      await api.profile.update(updates);

      removeStackedOverlays();
      const button = createButton(true);
      displayOverlay('Your profile has been updated!', button, true);
    } catch (error) {
      removeStackedOverlays();
      const button = createButton(false);
      displayOverlay(`Something went wrong: ${error.message}`, button);
      console.error(error);
    } finally {
      submitBtn.disabled = false;
    }
  });
}

export async function showEditProfileOverlay() {
  try {
    const user = await api.profile.view();
    if (!user) throw new Error('No user data returned');

    const form = buildProfileForm(user);
    onProfileSubmit(form);
    displayOverlay('Edit profile', form);
  } catch (error) {
    removeStackedOverlays();
    const button = createButton(false);
    displayOverlay(`Couldn't load profile: ${error.message}`, button);
    console.error(error);
  }
}
