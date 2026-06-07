import Header from "../../components/header/Header";
import MainLayout from "../../layout/MainLayout";
import ChatbotBox from "../../components/chatbot/ChatbotBox";

export default function ChatbotPage() {
  return (
    <MainLayout rightPanelType="chatHistory">
      <div className="flex h-full min-h-0 flex-col">
        <Header
          title="Own Repair Extend"
          subtitle="더 오래, 더 제대로"
          isMain
        />

        <div className="mt-[10px] flex-1 min-h-0">
          <ChatbotBox />
        </div>
      </div>
    </MainLayout>
  );
}