import { NextRequest, NextResponse } from 'next/server';
import { ConstructAnalyzer } from '@cdklabs/cdk-construct-analyzer';

export async function GET(
  request: NextRequest,
  { params }: { params: { packageName: string } }
) {
  try {
    const { packageName } = params;
    const analyzer = new ConstructAnalyzer();
    const result = await analyzer.analyzePackage(decodeURIComponent(packageName));
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to analyze package', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
