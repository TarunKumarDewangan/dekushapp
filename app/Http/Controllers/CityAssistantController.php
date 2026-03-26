<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CityAssistantController extends Controller
{
    /**
     * Handle the AI assistant query.
     */
    public function ask(Request $request)
    {
        $request->validate([
            'query' => 'required|string',
        ]);

        $query = $request->input('query');

        // Fetch context from database
        $services = Service::where('is_available', true)->get(['name', 'category', 'area', 'rating']);
        $shops = Shop::all(['name', 'category', 'description']);

        // Prepare the prompt
        $prompt = "You are the 'Smart City AI Guide'. Your goal is to help citizens find the best services and shops.\n\n";
        $prompt .= "Based on the user's query: \"{$query}\"\n\n";
        $prompt .= "Use the following real-time city data:\n";
        
        $prompt .= "SERVICES:\n";
        foreach ($services as $service) {
            $prompt .= "- {$service->name} ({$service->category}) in {$service->area}, Rating: {$service->rating}\n";
        }

        $prompt .= "\nSHOPS:\n";
        foreach ($shops as $shop) {
            $prompt .= "- {$shop->name} ({$shop->category}): {$shop->description}\n";
        }

        $prompt .= "\nIdentify the best matches. If the user has a problem (e.g., 'broken pipe'), recommend a relevant Service Provider. If they want to buy something, recommend a Shop.\n";
        $prompt .= "Be polite, concise, and helpful. Return your answer in a clear format.\n";

        // Call LLM (Placeholder for OpenAI/Google AI)
        // For actual implementation, the user needs to add their API KEY in .env
        $apiKey = config('services.openai.key');
        
        if (!$apiKey) {
            // Basic Keyword Filtering Mock
            $keywords = explode(' ', strtolower($query));
            $matchedServices = $services->filter(function ($s) use ($keywords) {
                foreach ($keywords as $k) {
                    if (strlen($k) > 2 && (str_contains(strtolower($s->name), $k) || str_contains(strtolower($s->category), $k))) return true;
                }
                return false;
            });

            $matchedShops = $shops->filter(function ($s) use ($keywords) {
                foreach ($keywords as $k) {
                    if (strlen($k) > 2 && (str_contains(strtolower($s->name), $k) || str_contains(strtolower($s->category), $k) || str_contains(strtolower($s->description), $k))) return true;
                }
                return false;
            });

            $answer = "I'm currently in basic mode, but based on your query, here's what I found:";
            if ($matchedServices->isNotEmpty()) {
                $answer .= " I found " . $matchedServices->count() . " relevant service(s) like " . $matchedServices->first()->name . ".";
            }
            if ($matchedShops->isNotEmpty()) {
                $answer .= " Also, " . $matchedShops->count() . " shop(s) might be helpful, such as " . $matchedShops->first()->name . ".";
            }
            if ($matchedServices->isEmpty() && $matchedShops->isEmpty()) {
                $answer = "I couldn't find specific matches for '{$query}', but you can browse all our verified local services and shops.";
            }

            return response()->json([
                'answer' => $answer,
                'recommendations' => [
                    'services' => $matchedServices->take(3)->values(),
                    'shops' => $matchedShops->take(3)->values()
                ],
                'categorySuggested' => $matchedServices->first()?->category ?? 'General'
            ]);
        }
    }
}
