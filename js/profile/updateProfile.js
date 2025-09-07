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
  const bioInput = createInputDiv('bio', {
    value: user.bio || '',
    placeholder: 'Tell people about yourself',
  });

  const avatarUrlInput = createInputDiv('avatarUrl', {
    labelText: 'Avatar URL',
    type: 'url',
    value: user.avatar?.url || '',
    placeholder: 'Enter valid URL for avatar image',
  });

  const avatarAltInput = createInputDiv('avatarAlt', {
    labelText: 'Avatar Alt',
    value: user.avatar?.alt || '',
    placeholder: 'Describe your avatar',
  });

  const bannerUrlInput = createInputDiv('bannerUrl', {
    labelText: 'Banner URL',
    type: 'url',
    value: user.banner?.url || '',
    placeholder: 'Enter valid URL for banner image',
  });

  const bannerAltInput = createInputDiv('bannerAlt', {
    labelText: 'Banner Alt',
    value: user.banner?.alt || '',
    placeholder: 'Describe your banner',
  });

  const submitBtn = createSubmitButton('save changes');

  const form = createOverlayForm([
    bioInput,
    avatarUrlInput,
    avatarAltInput,
    bannerUrlInput,
    bannerAltInput,
    submitBtn,
  ]);

  return form;
}

function getUpdates(form) {
  const formData = new FormData(form);
  return {
    bio: (formData.get('bio') || '').trim(),
    avatar: {
      url: (formData.get('avatarUrl') || '').trim(),
      alt: (formData.get('avatarAlt') || '').trim(),
    },
    banner: {
      url: (formData.get('bannerUrl') || '').trim(),
      alt: (formData.get('bannerAlt') || '').trim(),
    },
  };
}

function onProfileSubmit(form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'updating...';
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
