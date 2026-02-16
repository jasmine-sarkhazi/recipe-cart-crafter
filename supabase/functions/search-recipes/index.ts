import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a recipe search assistant. When given a search query, return exactly 6 recipes as a JSON array. Each recipe must have these fields:
- "name": string (recipe name)
- "description": string (1-2 sentence description)
- "instructions": string (detailed step-by-step cooking instructions, each step numbered on a new line)
- "source_url": string (a real URL to a popular recipe website where this or a very similar recipe can be found, e.g. allrecipes.com, foodnetwork.com, seriouseats.com, budgetbytes.com, etc.)
- "ingredients": array of objects with "ingredient_name" (string), "default_quantity" (number), "default_unit" (string like "cups", "lbs", "oz", "pieces", "tbsp", "tsp", "cloves", "cans")

Return ONLY the JSON array, no markdown, no code fences, no extra text.`,
          },
          {
            role: 'user',
            content: `Search for recipes: ${query}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI gateway error:', errText);
      return new Response(JSON.stringify({ error: 'AI search failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';

    let recipes;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recipes = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse recipes:', content);
      recipes = [];
    }

    return new Response(JSON.stringify({ recipes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
