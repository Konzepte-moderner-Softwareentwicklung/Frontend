import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Offer {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  features?: string[];
  longDescription?: string;
}

export default function OfferDetail() {
  const { offerId } = useParams();
  const navigate = useNavigate();

  // Mock data for demonstration
  const offers: Record<string, Offer> = {
    "1": {
      id: "1",
      title: "Premium Package",
      price: 99.99,
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=60",
      description: "Get access to all premium features",
      longDescription:
        "Our Premium Package is designed for professionals who need the best tools and features to succeed. With this package, you'll get access to all our premium features, priority support, and exclusive content.",
      features: [
        "Unlimited access to all premium features",
        "Priority customer support",
        "Advanced analytics and reporting",
        "Custom integrations",
        "Team collaboration tools",
        "API access",
      ],
    },
    "2": {
      id: "2",
      title: "Basic Package",
      price: 49.99,
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
      description: "Perfect for getting started",
      longDescription:
        "The Basic Package is ideal for individuals and small teams who are just getting started. It includes all the essential features you need to begin your journey.",
      features: [
        "Access to core features",
        "Email support",
        "Basic analytics",
        "Standard integrations",
        "Up to 5 team members",
      ],
    },
    "3": {
      id: "3",
      title: "Enterprise Package",
      price: 199.99,
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60",
      description: "For large organizations",
      longDescription:
        "Our Enterprise Package is tailored for large organizations that need advanced features, dedicated support, and custom solutions to meet their specific requirements.",
      features: [
        "All Premium features included",
        "Dedicated account manager",
        "Custom development support",
        "Advanced security features",
        "Unlimited team members",
        "SLA guarantees",
        "Custom training sessions",
      ],
    },
    "4": {
      id: "4",
      title: "Student Package",
      price: 29.99,
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60",
      description: "Special pricing for students",
      longDescription:
        "The Student Package is designed to help students learn and grow with our platform at an affordable price. It includes all the essential features needed for educational purposes.",
      features: [
        "Access to core features",
        "Educational resources",
        "Student community access",
        "Basic analytics",
        "Email support",
      ],
    },
  };

  const offer = offers[offerId || ""];

  if (!offer) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-800">Offer Not Found</h1>
        <p className="mb-4 text-green-700">The offer you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/offers")} className="bg-green-700 text-white hover:bg-green-800 border border-green-700">Back to Offers</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate("/offers")}
          className="mb-8 border-green-300 text-green-800 hover:text-green-900 hover:border-green-600 bg-white"
        >
          ← Back to Offers
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src={offer.imageUrl}
              alt={offer.title}
              className="w-full h-[400px] object-cover rounded-2xl border border-green-100 shadow-md"
            />
          </div>

          <Card className="bg-white border border-green-200 rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-green-900 font-extrabold tracking-tight">{offer.title}</CardTitle>
              <p className="text-2xl font-bold text-green-700 mt-2">${offer.price}</p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-green-800">Beschreibung</h2>
                <p className="text-green-700 leading-relaxed">{offer.longDescription}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2 text-green-800">Features</h2>
                <ul className="space-y-2">
                  {offer.features?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-green-900">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg border border-green-700 shadow-md text-lg">
                Paket auswählen
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 