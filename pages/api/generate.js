import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const data = req.body.data || '';
  if (data.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(data),
      temperature: 0.2,
		max_tokens: 1000,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(data) {
  const capitalizedText =
    data[0].toUpperCase() + data.slice(1).toLowerCase();
  return `You are an expert in analyzing dating profiles you rate profiles on the scale from 1 - 10, 1 is the worst and 10 is the best.	Include a brief answer as to why you rated my profile the way you did and some examples on how they could add creativity and make it better.
  		example profile: {styles.result}
  		your rating: 1
  		example profile: I'm a mom and ophthalmologist, and in my spare time I like going to museums and coffee shops. I'm creative and motivated. Let's connect!
  		your rating: 3
  		example profile: I am a sensitive person who likes to take care of others. But not to the point of being a doormat! I volunteer at the Museum of Modern Art whenever possible because I'm a frustrated artist who became an ophthalmologist. I still love to see art and paint with my daughter whenever possible. Also, I love to spend time off walking through new cities: street art and checking out hole in the wall coffee shops are my thing.
  		your rating: 8
  		example profile: Listen – I know I’m just a poor man’s Zooey Deschanel and I can’t even promise you love or sex or even affection, but I can guarantee: a very public Celine Dion serenade with elaborate arm choreography a deep-fake English accent if you’re American or absolutely nothing but shame if you’re British a medium-rare steak so nice it would make Ron Swanson weep a collection of useless pub trivia that is 72% accurate most of the time a conversation filled with fun and laughter
		your rating: 9


			${capitalizedText}
`

}
