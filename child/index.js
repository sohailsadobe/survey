window.initFeedbackModal = function({ guid, version }) {
  const cancelBtn = document.getElementById('cancel-btn');
  const form = document.getElementById('feedback-form');
  const thankYouMsg = document.getElementById('thank-you-message');
  const formContainer = document.getElementById('form-container');
  const backdrop = document.getElementById('modal-backdrop');

  cancelBtn.addEventListener('click', () => {
    backdrop.remove(); // close modal on cancel
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const rating = form.rating.value;
    if (!rating) {
      alert('Please select a rating.');
      return;
    }

    const feedback = form.feedback.value;
    const contactAllowed = form.contact.checked;

    const payload = {
      event: {
        xdm: {
          eventType: "decisioning.propositionFetch",
          identityMap: {
            adobeGUID: [
              {
                id: guid,
                authenticatedState: "authenticated",
                primary: true
              }
            ]
          },
          _adobe_corpnew: {
            app: {
              installedApplications: [
                {
                  id: "PHXS",
                  language: "sentnow",
                  name: guid,
                  version: version
                }
              ]
            }
          },
          timestamp: new Date().toISOString(),
          homeAddress: {
            countryCode: "US"
          },
          productArrangementCode: "phsp_direct_individual"
        }
      },
      query: {
        personalization: {
          schemas: [
            "https://ns.adobe.com/personalization/default-content-item",
            "https://ns.adobe.com/personalization/html-content-item",
            "https://ns.adobe.com/personalization/json-content-item",
            "https://ns.adobe.com/personalization/redirect-item",
            "https://ns.adobe.com/personalization/dom-action"
          ],
          surfaces: [
            "web://sohails.test.com"
          ]
        }
      },
      rating,
      feedback,
      contactAllowed
    };

    fetch("https://edge.adobedc.net/ee/v2/interact?datastreamId=cbb9ad82-3cea-4dae-91af-51ef2839dfe4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      console.log("Success:", data);
      formContainer.style.display = 'none';
      thankYouMsg.style.display = 'block';
    })
    .catch(error => {
      console.error("Error:", error);
      alert("There was a problem submitting your feedback. Please try again later.");
    });
  });
};
