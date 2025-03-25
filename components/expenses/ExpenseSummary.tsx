"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit, Plus } from "lucide-react";
import { ExpenseSummary as ExpenseSummaryType } from "@/types/types";
import { toast } from "sonner";

interface ExpenseSummaryProps {
  summaries: ExpenseSummaryType[];
  categories: string[];
  paymentModes: string[];
}

type CardConfig = {
  id: string;
  type: "monthly" | "yearly" | "custom";
  title: string;
  filters: {
    month?: number;
    year?: number;
    category?: string;
    paymentMode?: string;
  };
  isDefault?: boolean;
};

export function ExpenseSummary({ summaries, categories, paymentModes }: ExpenseSummaryProps) {
  const [cards, setCards] = React.useState<CardConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCardId, setEditingCardId] = React.useState<string | null>(null);
  const [newCardFilters, setNewCardFilters] = React.useState<CardConfig["filters"]>({
    month: undefined,
    year: undefined,
    category: undefined,
    paymentMode: undefined,
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();

  // Initialize default cards
  React.useEffect(() => {
    const monthlyTotal = {
      id: "monthly-total",
      type: "monthly" as const,
      title: `Total Spent - ${currentDate.toLocaleString("default", { month: "long" })} ${currentYear}`,
      filters: { month: currentMonth, year: currentYear },
      isDefault: true,
    };

    const yearlyTotal = {
      id: "yearly-total",
      type: "yearly" as const,
      title: `Total Spent - ${currentYear}`,
      filters: { year: currentYear },
      isDefault: true,
    };

    const categoryTotals = summaries
      .filter((s) => s.year === currentYear)
      .reduce((acc: { [key: string]: number }, s) => {
        acc[s.category] = (acc[s.category] || 0) + s.totalAmount;
        return acc;
      }, {});
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || categories[0] || "N/A";
    const randomCard = {
      id: "random-category",
      type: "custom" as const,
      title: `${topCategory} - ${currentYear}`,
      filters: { year: currentYear, category: topCategory },
      isDefault: true,
    };

    setCards((prev) => {
      const customCards = prev.filter((card) => !card.isDefault);
      return [...[monthlyTotal, yearlyTotal, randomCard], ...customCards.slice(0, 3)]; // Max 3 custom cards
    });
  }, [summaries, categories, currentMonth, currentYear]);

  // Calculate total amount for a card
  const getCardTotal = (filters: CardConfig["filters"]) => {
    return summaries
      .filter((s) => {
        return (
          (!filters.month || s.month === filters.month) &&
          (!filters.year || s.year === filters.year) &&
          (!filters.category || s.category === filters.category) &&
          (!filters.paymentMode || s.paymentMode === filters.paymentMode)
        );
      })
      .reduce((sum, s) => sum + s.totalAmount, 0);
  };

  // Handle adding or editing a card
  const handleAddOrEditCard = () => {
    if (cards.length >= 6 && !editingCardId) {
      toast.error("Limit Reached", { description: "You can only have up to 6 cards." });
      return;
    }

    const titleParts = [];
    if (newCardFilters.month)
      titleParts.push(new Date(0, newCardFilters.month - 1).toLocaleString("default", { month: "long" }));
    if (newCardFilters.year) titleParts.push(newCardFilters.year.toString());
    if (newCardFilters.category) titleParts.push(newCardFilters.category);
    if (newCardFilters.paymentMode) titleParts.push(newCardFilters.paymentMode);
    const title = titleParts.length > 0 ? titleParts.join(" - ") : "Custom Summary";

    const newCard: CardConfig = {
      id: editingCardId || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: "custom",
      title,
      filters: { ...newCardFilters },
    };

    if (editingCardId) {
      setCards((prev) => prev.map((card) => (card.id === editingCardId ? newCard : card)));
      toast.success("Card Updated", { description: "Your summary card has been updated." });
    } else {
      setCards((prev) => [...prev, newCard]);
      toast.success("Card Added", { description: "Your summary card has been added." });
    }

    setNewCardFilters({ month: undefined, year: undefined, category: undefined, paymentMode: undefined });
    setEditingCardId(null);
    setIsModalOpen(false);
  };

  const handleEditCard = (card: CardConfig) => {
    setEditingCardId(card.id);
    setNewCardFilters({ ...card.filters });
    setIsModalOpen(true);
  };

  const handleRemoveCard = (id: string) => {
    if (cards.find((card) => card.id === id)?.isDefault) {
      toast.error("Cannot Remove", { description: "Default cards cannot be removed." });
      return;
    }
    setCards((prev) => prev.filter((card) => card.id !== id));
    toast.success("Card Removed", { description: "The summary card has been removed." });
  };

  const uniqueYears = [...new Set(summaries.map((s) => s.year))];

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
              {!card.isDefault && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCard(card)}
                    className="group"
                  >
                    <Edit className="h-4 w-4 group-hover:text-primary transition-colors" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCard(card.id)}
                    className="group"
                  >
                    <Trash2 className="h-4 w-4 group-hover:text-destructive transition-colors" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-primary">
                ${getCardTotal(card.filters).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full sm:w-auto transition-all duration-300 hover:scale-105"
            disabled={cards.length >= 6}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Custom Card
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCardId ? "Edit Card" : "Add New Card"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Month (optional)</label>
              <Select
                value={newCardFilters.month?.toString() || ""}
                onValueChange={(value) =>
                  setNewCardFilters({ ...newCardFilters, month: value ? parseInt(value) : undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Year (optional)</label>
              <Select
                value={newCardFilters.year?.toString() || ""}
                onValueChange={(value) =>
                  setNewCardFilters({ ...newCardFilters, year: value ? parseInt(value) : undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Category (optional)</label>
              <Select
                value={newCardFilters.category || ""}
                onValueChange={(value) =>
                  setNewCardFilters({ ...newCardFilters, category: value || undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Mode (optional)</label>
              <Select
                value={newCardFilters.paymentMode || ""}
                onValueChange={(value) =>
                  setNewCardFilters({ ...newCardFilters, paymentMode: value || undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  {paymentModes.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddOrEditCard}
                className="flex-1 transition-all duration-300 hover:scale-105"
              >
                {editingCardId ? "Update" : "Add"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setNewCardFilters({ month: undefined, year: undefined, category: undefined, paymentMode: undefined });
                  setEditingCardId(null);
                  setIsModalOpen(false);
                }}
                className="flex-1 transition-all duration-300 hover:scale-105"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {cards.length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No expense summary available.
        </div>
      )}
    </div>
  );
}